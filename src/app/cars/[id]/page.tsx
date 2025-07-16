import prisma from '@/lib/prisma'; // Import the shared prisma instance
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";

// We no longer create a new PrismaClient here.

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    // This now uses the single, optimized database connection.
    const car = await prisma.car.findUnique({
        where: { id: params.id },
    });

    if (!car) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <CarDetailsClient car={car} />
        </div>
    );
}
