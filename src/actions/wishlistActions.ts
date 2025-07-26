'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export async function toggleWishlist(carId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error('Unauthorized');

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { wishlist: true },
    });

    if (!user) throw new Error('User not found');

    const isWishlisted = user.wishlist.some((car) => car.id === carId);

    if (isWishlisted) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                wishlist: {
                    disconnect: { id: carId },
                },
            },
        });
    } else {
        await prisma.user.update({
            where: { id: userId },
            data: {
                wishlist: {
                    connect: { id: carId },
                },
            },
        });
    }

    revalidatePath('/cars');
    revalidatePath(`/cars/${carId}`);
}
