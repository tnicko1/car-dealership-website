import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import AdminForm from '@/components/AdminForm';
import type { CarWithImages } from '@/types/car';

interface EditCarPageProps {
    params: {
        id: string;
    };
}

// This function helps Next.js resolve dynamic paths and can fix type issues during build.
// We return an empty array because we don't have any static paths to generate at build time.
export async function generateStaticParams() {
    return [];
}

export default async function EditCarPage({ params }: EditCarPageProps) {
    const car = await prisma.car.findUnique({
        where: { id: params.id },
        include: {
            images: true,
        },
    });

    if (!car) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Edit Car</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                {/* Pass the car data to the form component */}
                <AdminForm car={car as CarWithImages} />
            </div>
        </div>
    );
}
