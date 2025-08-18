'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Use the admin client

interface ActionResult {
    success: boolean;
    error?: string;
}

// Helper function to parse form data
const getCarData = (formData: FormData) => {
    return {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        mileage: Number(formData.get('mileage')),
        horsepower: Number(formData.get('horsepower')),
        fuelType: formData.get('fuelType') as string,
        transmission: formData.get('transmission') as string,
        bodyStyle: formData.get('bodyStyle') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        engineVolume: Number(formData.get('engineVolume')),
        cylinders: Number(formData.get('cylinders')),
        driveWheels: formData.get('driveWheels') as string,
        doors: Number(formData.get('doors')),
        airbags: Number(formData.get('airbags')),
        wheel: formData.get('wheel') as string,
        color: formData.get('color') as string,
        interiorColor: formData.get('interiorColor') as string,
        interiorMaterial: formData.get('interiorMaterial') as string,
        exchange: formData.get('exchange') === 'on',
        technicalInspection: formData.get('technicalInspection') === 'on',
        comfort: (formData.get('comfort') as string)?.split(',').map(f => f.trim()).filter(f => f) || [],
        safety: (formData.get('safety') as string)?.split(',').map(f => f.trim()).filter(f => f) || [],
        multimedia: (formData.get('multimedia') as string)?.split(',').map(f => f.trim()).filter(f => f) || [],
        other: (formData.get('other') as string)?.split(',').map(f => f.trim()).filter(f => f) || [],
    };
};

// Helper function to upload images to Supabase
async function uploadImages(files: File[]): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (const file of files) {
        const { data, error } = await supabaseAdmin.storage
            .from('car-images')
            .upload(`${Date.now()}-${file.name}`, file);

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error('Failed to upload one or more images.');
        }
        
        const { publicUrl } = supabaseAdmin.storage.from('car-images').getPublicUrl(data.path).data;
        uploadedUrls.push(publicUrl);
    }
    return uploadedUrls;
}

// Server Action to add a new car
export async function addCar(formData: FormData): Promise<ActionResult> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        const carData = getCarData(formData);
        const imageFiles = formData.getAll('newImages') as File[]; // Corrected from 'images'
        const imageUrls = await uploadImages(imageFiles);

        await prisma.car.create({
            data: {
                ...carData,
                userId: session.user.id,
                images: {
                    create: imageUrls.map(url => ({ url })),
                },
            },
        });

        revalidatePath('/admin');
        revalidatePath('/cars');
        return { success: true };
    } catch (e) {
        return { success: false, error: (e as Error).message };
    }
}

// Server Action to update an existing car
export async function updateCar(id: string, formData: FormData): Promise<ActionResult> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    try {
        const carData = getCarData(formData);
        const newImageFiles = formData.getAll('newImages') as File[];
        const existingImageUrls = formData.getAll('existingImages') as string[];

        const existingCar = await prisma.car.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!existingCar) return { success: false, error: 'Car not found' };

        if (session.user.role !== 'admin' && existingCar.userId !== session.user.id) {
            return { success: false, error: 'Unauthorized' };
        }

        const newUploadedUrls = await uploadImages(newImageFiles);
        const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];

        const originalImageUrls = existingCar.images.map(image => image.url);
        const urlsToDelete = originalImageUrls.filter(url => !finalImageUrls.includes(url));
        const pathsToDelete = urlsToDelete.map(url => url.split('/').pop()).filter(Boolean) as string[];

        if (pathsToDelete.length > 0) {
            await supabaseAdmin.storage.from('car-images').remove(pathsToDelete);
        }

        await prisma.$transaction(async (tx) => {
            await tx.carImage.deleteMany({ where: { carId: id } });
            await tx.car.update({
                where: { id },
                data: {
                    ...carData,
                    images: {
                        create: finalImageUrls.map(url => ({ url })),
                    },
                },
            });
        });

        revalidatePath('/admin');
        revalidatePath('/cars');
        revalidatePath(`/cars/${id}`);
        return { success: true };
    } catch (e) {
        return { success: false, error: (e as Error).message };
    }
}

// Server Action to remove a car
export async function removeCar(id: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    const car = await prisma.car.findUnique({ where: { id }, include: { images: true } });
    if (!car) throw new Error('Car not found');

    // Authorization check: user must be admin or car owner
    if (session.user.role !== 'admin' && car.userId !== session.user.id) {
        throw new Error('Unauthorized');
    }

    const imagePaths = car.images.map(image => {
        const parts = image.url.split('/');
        return parts[parts.length - 1];
    }).filter(Boolean) as string[];
    
    if (imagePaths.length > 0) {
        const { error } = await supabaseAdmin.storage.from('car-images').remove(imagePaths);
        if (error) {
            console.error('Error deleting images from Supabase:', error);
            // We can choose to continue even if image deletion fails
        }
    }

    await prisma.car.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/cars');
    revalidatePath('/my-listings');
}