'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config'; // Import from the new central file
import { supabase } from '@/lib/supabase';

// This helper function now creates a descriptive and unique filename
async function uploadImageAndGetUrl(imageFile: File, make: string, model: string) {
    if (!imageFile || imageFile.size === 0) {
        return null;
    }

    const baseName = `${make}-${model}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = imageFile.name.split('.').pop();
    const fileName = `${baseName}-${randomString}.${extension}`;

    const { data, error } = await supabase.storage
        .from('car-images')
        .upload(fileName, imageFile);

    if (error) {
        throw new Error('Image upload failed: ' + error.message);
    }

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

    await prisma.car.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/cars');
}
