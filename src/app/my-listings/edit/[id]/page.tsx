import prisma from "@/lib/prisma";
import { notFound, redirect } from 'next/navigation';
import CarForm from '@/components/CarForm';
import type { CarWithImages } from '@/types/car';
import { getAllMakes } from '@/lib/carData';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

export default async function EditCarPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/login');
    }

    const [car, makes] = await Promise.all([
        prisma.car.findUnique({
            where: { id: params.id },
            include: {
                images: true,
            },
        }),
        getAllMakes(),
    ]);

    if (!car) {
        notFound();
    }

    // Authorization check
    if (car.userId !== session.user.id) {
        redirect('/');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Edit Car</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <CarForm car={car as CarWithImages} makes={makes} />
            </div>
        </div>
    );
}
