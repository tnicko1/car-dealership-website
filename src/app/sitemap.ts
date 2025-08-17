import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const URL = 'https://yourdealership.netlify.app/'; // IMPORTANT: Replace with your actual production URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch all cars from the database
    const cars = await prisma.car.findMany({
        select: {
            id: true,
            updatedAt: true,
        },
    });

    const carEntries: MetadataRoute.Sitemap = cars.map(({ id, updatedAt }) => ({
        url: `${URL}/cars/${id}`,
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Define static pages
    const staticPages = [
        { url: '/', priority: 1.0 },
        { url: '/cars', priority: 0.9 },
        { url: '/about', priority: 0.7 },
        { url: '/contact', priority: 0.6 },
    ];

    const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
        url: `${URL}${page.url}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: page.priority,
    }));

    return [
        ...staticEntries,
        ...carEntries,
    ];
}
