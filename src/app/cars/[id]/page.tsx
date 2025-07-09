import { PrismaClient } from '@prisma/client';
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

// Define a specific interface for the page's props
interface CarDetailsPageProps {
    params: {
        id: string;
    };
}

// This function tells Next.js which pages to build statically
export async function generateStaticParams() {
    const cars = await prisma.car.findMany({
        select: { id: true },
    });
    return cars.map((car) => ({
        id: car.id,
    }));
}

// This is the main server component for the page
export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
    const { id } = params; // Destructure the id from params

    const car = await prisma.car.findUnique({
        where: { id: id },
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
