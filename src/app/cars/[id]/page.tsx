import prisma from '@/lib/prisma';
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";
import type { CarWithImages } from '@/types/car';

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
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
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <CarDetailsClient car={car as CarWithImages} />
        </div>
    );
}
