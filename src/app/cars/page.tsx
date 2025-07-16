import prisma from '@/lib/prisma';
import CarCard from "@/components/CarCard";
import FilterSidebar from '@/components/FilterSidebar';
import type { Car } from '@prisma/client';

// This page is now dynamic because it reads search parameters
export default async function InventoryPage({
                                                searchParams,
                                            }: {
    searchParams?: {
        make?: string;
        model?: string;
        minPrice?: string;
        maxPrice?: string;
    };
}) {
    const make = searchParams?.make;
    const model = searchParams?.model;
    const minPrice = Number(searchParams?.minPrice) || 0;
    const maxPrice = searchParams?.maxPrice; // Get the raw value

    // Build the dynamic where clause for Prisma
    const whereClause: any = {
        price: {
            gte: minPrice,
        }
    };

    // Only add the 'lte' condition if a valid maxPrice is provided
    if (maxPrice && !isNaN(Number(maxPrice))) {
        whereClause.price.lte = Number(maxPrice);
    }

    if (make) {
        whereClause.make = make;
    }
    if (model) {
        whereClause.model = {
            contains: model,
            mode: 'insensitive',
        };
    }

    // Fetch the cars based on the filters
    const cars: Car[] = await prisma.car.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
    });

    // Fetch all unique makes for the filter dropdown
    const makes = (await prisma.car.findMany({
        select: { make: true },
        distinct: ['make'],
    })).map(car => car.make);

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Inventory</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">Find the perfect vehicle for you.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <FilterSidebar makes={makes} />
                </div>

                {/* Car Grid */}
                <div className="lg:col-span-3">
                    {cars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {cars.map((car) => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-bold">No Cars Found</h2>
                            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
