import { DUMMY_CARS } from "@/data/dummy-cars";
import CarDetailsClient from "@/components/CarDetailsClient";
import { notFound } from "next/navigation";

export default function CarDetailsPage({ params }: { params: { id: string } }) {
    const car = DUMMY_CARS.find((c) => c.id === params.id);

    if (!car) {
        // This function will render the not-found.tsx file if you have one, or a default 404 page.
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-fade-in">
            <CarDetailsClient car={car} />
        </div>
    );
}

// This function helps Next.js know which car IDs are available to generate static pages at build time.
export async function generateStaticParams() {
    return DUMMY_CARS.map((car) => ({
        id: car.id,
    }));
}
