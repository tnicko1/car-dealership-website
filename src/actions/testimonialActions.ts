'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export async function getTestimonials() {
    try {
        return await prisma.testimonial.findMany({
            orderBy: { createdAt: 'desc' },
            take: 6, // Fetch more for the slider
        });
    } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        return [];
    }
}

export async function addTestimonial(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') throw new Error('Unauthorized');

    const data = {
        name: formData.get('name') as string,
        testimonial: formData.get('testimonial') as string,
        rating: Number(formData.get('rating')),
    };

    await prisma.testimonial.create({ data });

    revalidatePath('/admin/testimonials');
    revalidatePath('/');
}
