'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { redirect } from 'next/navigation';

// Server Action to add a new car
export async function addCar(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const data = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        mileage: Number(formData.get('mileage')),
        horsepower: Number(formData.get('horsepower')),
        fuelType: formData.get('fuelType') as string,
        transmission: formData.get('transmission') as string,
        bodyStyle: formData.get('bodyStyle') as string,
        imageUrls: formData.getAll('imageUrls[]') as string[],
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    await prisma.car.create({ data });

    revalidatePath('/admin');
    revalidatePath('/cars');
}

// NEW Server Action to update an existing car
export async function updateCar(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const data = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        mileage: Number(formData.get('mileage')),
        horsepower: Number(formData.get('horsepower')),
        fuelType: formData.get('fuelType') as string,
        transmission: formData.get('transmission') as string,
        bodyStyle: formData.get('bodyStyle') as string,
        imageUrls: formData.getAll('imageUrls[]') as string[],
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    await prisma.car.update({ where: { id }, data });

    revalidatePath('/admin');
    revalidatePath('/cars');
    revalidatePath(`/cars/${id}`);
    redirect('/admin'); // Redirect back to the admin panel after updating
}

// Server Action to remove a car
export async function removeCar(id: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    // Note: This does not delete the image from Supabase Storage.
    await prisma.car.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/cars');
}
