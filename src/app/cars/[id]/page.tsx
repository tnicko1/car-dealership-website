import { PrismaClient } from '@prisma/client';
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";

// This tells Next.js to cache each individual car page and revalidate the data at most once every 60 seconds.
export const revalidate = 60;

const prisma = new PrismaClient();

// This function tells Next.js which pages to build statically at deploy time
export async function generateStaticParams() {
    try {
        const cars = await prisma.car.findMany({
            select: { id: true },
        });
        return cars.map((car) => ({
            id: car.id,
        }));
    } catch (error) {
        console.error("Failed to generate static params:", error);
        return [];
    }
}

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
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
