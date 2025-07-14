import prisma from '@/lib/prisma'; // Import the shared prisma instance
import CarCard from "@/components/CarCard";
import type { Car } from '@prisma/client'; // Import the Car type for clarity

// This line prevents database connection issues at runtime.
export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    // This now uses the single, optimized database connection.
    const cars: Car[] = await prisma.car.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Inventory</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">Browse our full selection of quality vehicles.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {/* Filter section placeholder */}
                <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-center font-semibold">Advanced Filters Coming Soon!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car, index) => (
                        <div key={car.id} className="animate-slide-in-up" style={{animationDelay: `${0.05 * index}s`}}>
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
