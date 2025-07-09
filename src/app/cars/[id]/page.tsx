import { PrismaClient } from '@prisma/client';
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

// This function tells Next.js which pages to build statically
export async function generateStaticParams() {
    const cars = await prisma.car.findMany({
        select: { id: true },
    });
    // Add explicit type to the 'car' parameter to resolve the TS7006 error.
    return cars.map((car: { id: string }) => ({
        id: car.id,
    }));
}

// This is the main server component for the page
export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    const car = await prisma.car.findUnique({
        where: { id: params.id },
    });

    if (!car) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            {/* We pass the fetched server data to the client component */}
            <CarDetailsClient car={car} />
        </div>
    );
}
