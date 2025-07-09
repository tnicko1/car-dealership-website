'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Import the authOptions

// Server Action to add a new car
export async function addCar(formData: FormData) {
    const session = await getServerSession(authOptions); // Get session using v4 pattern
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const data = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        imageUrl: formData.get('imageUrl') as string,
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    await prisma.car.create({ data });

    revalidatePath('/admin');
    revalidatePath('/cars');
}

// Server Action to update an existing car
export async function updateCar(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const data = {
        make: formData.get('make') as string,
        model: formData.get('model') as string,
        year: Number(formData.get('year')),
        price: Number(formData.get('price')),
        imageUrl: formData.get('imageUrl') as string,
        description: formData.get('description') as string,
        features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
    };

    await prisma.car.update({
        where: { id },
        data,
    });

    revalidatePath('/admin');
    revalidatePath('/cars');
    revalidatePath(`/cars/${id}`);
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
