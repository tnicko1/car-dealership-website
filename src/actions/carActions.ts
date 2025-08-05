'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {CarWithImages} from "@/types/car";

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
        comfort: (formData.get('comfort') as string).split(',').map(f => f.trim()).filter(f => f),
        safety: (formData.get('safety') as string).split(',').map(f => f.trim()).filter(f => f),
        multimedia: (formData.get('multimedia') as string).split(',').map(f => f.trim()).filter(f => f),
        other: (formData.get('other') as string).split(',').map(f => f.trim()).filter(f => f),
    };
};

export async function getCar(id: string): Promise<CarWithImages | null> {
    return await prisma.car.findUnique({
        where: {id},
        include: {
            images: true,
        },
    });
}

// Server Action to add a new car
export async function addCar(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const carData = getCarData(formData);
    const imageUrls = formData.getAll('images') as string[];

    const car = await prisma.car.create({
        data: {
            ...carData,
            images: {
                create: imageUrls.map(url => ({ url })),
            },
        },
    });

    revalidatePath('/admin');
    revalidatePath('/cars');
    redirect('/admin');
}

// Server Action to update an existing car
export async function updateCar(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const carData = getCarData(formData);
    const imageUrls = formData.getAll('images') as string[];

    await prisma.$transaction(async (tx) => {
        await tx.carImage.deleteMany({ where: { carId: id } });
        await tx.car.update({
            where: { id },
            data: {
                ...carData,
                images: {
                    create: imageUrls.map(url => ({ url })),
                },
            },
        });
    });

    revalidatePath('/admin');
    revalidatePath('/cars');
    revalidatePath(`/cars/${id}`);
    redirect('/admin');
}

// Server Action to remove a car
export async function removeCar(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const car = await prisma.car.findUnique({ where: { id }, include: { images: true } });
    if (!car) throw new Error('Car not found');

    // Delete images from Supabase Storage
    const imagePaths = car.images.map(image => {
        const parts = image.url.split('/');
        return parts[parts.length - 1];
    });
    
    if (imagePaths.length > 0) {
        const { error } = await supabase.storage.from('car-images').remove(imagePaths);
        if (error) {
            console.error('Error deleting images from Supabase:', error);
        }
    }

    await prisma.car.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/cars');
}