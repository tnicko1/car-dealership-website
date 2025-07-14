import { PrismaClient } from '@prisma/client';
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

// By removing generateStaticParams, this page becomes fully dynamic.
// It will be rendered on the server for each request, which avoids the build-time database connection error.

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
