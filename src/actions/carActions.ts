'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// This helper function now creates a descriptive and unique filename
async function uploadImageAndGetUrl(imageFile: File, make: string, model: string) {
    if (!imageFile || imageFile.size === 0) {
        return null;
    }

    // 1. Sanitize the make and model to create a clean base for the filename
    const baseName = `${make}-${model}`
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric characters except hyphens

    // 2. Add a short random string to prevent filename conflicts
    const randomString = Math.random().toString(36).substring(2, 8);

    // 3. Get the original file extension
    const extension = imageFile.name.split('.').pop();

    // 4. Combine them into the final, unique filename
    const fileName = `${baseName}-${randomString}.${extension}`;

    // Upload the file with the new name to the "car-images" bucket
    const { data, error } = await supabase.storage
        .from('car-images') // Using your specified bucket name
        .upload(fileName, imageFile);

    if (error) {
        throw new Error('Image upload failed: ' + error.message);
    }

    // Get the public URL for the newly uploaded file
    const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(data.path);

    return publicUrl;
}


// Server Action to add a new car
export async function addCar(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const imageFile = formData.get('imageFile') as File;
    let imageUrl = formData.get('imageUrl') as string;
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;

    // If a file is being uploaded, process it to get the URL
    if (imageFile && imageFile.size > 0) {
        const uploadedUrl = await uploadImageAndGetUrl(imageFile, make, model);
        if (uploadedUrl) {
            imageUrl = uploadedUrl;
        }
    }

    if (!imageUrl) {
        throw new Error('Image URL or file is required.');
    }

    const data = {
        make,
        model,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        imageUrl: imageUrl,
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    await prisma.car.create({ data });

    revalidatePath('/admin');
    revalidatePath('/cars');
}

// Server Action to remove a car
export async function removeCar(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    // Note: This does not delete the image from Supabase Storage.
    // A more advanced implementation would also remove the file from the bucket.
    await prisma.car.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/cars');
}
