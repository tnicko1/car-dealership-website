import prisma from '@/lib/prisma';
import CarCard from "@/components/CarCard";
import FilterSidebar from '@/components/FilterSidebar';
import type { CarWithImages } from '@/types/car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export default async function InventoryPage({
    searchParams,
}: {
    searchParams?: {
        make?: string;
        model?: string;
        minPrice?: string;
        maxPrice?: string;
        bodyStyle?: string;
        transmission?: string;
        fuelType?: string;
        minYear?: string;
        maxYear?: string;
        maxMileage?: string;
    };
}) {
    const make = searchParams?.make;
    const model = searchParams?.model;
    const minPrice = Number(searchParams?.minPrice) || 0;
    const maxPrice = searchParams?.maxPrice;
    const bodyStyle = searchParams?.bodyStyle;
    const transmission = searchParams?.transmission;
    const fuelType = searchParams?.fuelType;
    const minYear = searchParams?.minYear;
    const maxYear = searchParams?.maxYear;
    const maxMileage = search?.maxMileage;

    const whereClause: any = {
        price: {
            gte: minPrice,
        },
    };

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
    if (bodyStyle) {
        whereClause.bodyStyle = bodyStyle;
    }
    if (transmission) {
        whereClause.transmission = transmission;
    }
    if (fuelType) {
        whereClause.fuelType = fuelType;
    }
    if (minYear) {
        whereClause.year = { ...whereClause.year, gte: Number(minYear) };
    }
    if (maxYear) {
        whereClause.year = { ...whereClause.year, lte: Number(maxYear) };
    }
    if (maxMileage) {
        whereClause.mileage = { ...whereClause.mileage, lte: Number(maxMileage) };
    }

    const session = await getServerSession(authOptions);

    const [cars, makes, bodyStyles, fuelTypes, transmissions, user] = await Promise.all([
        prisma.car.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        }),
        prisma.car.findMany({ select: { make: true }, distinct: ['make'] }).then(res => res.map(c => c.make)),
        prisma.car.findMany({ select: { bodyStyle: true }, distinct: ['bodyStyle'] }).then(res => res.map(c => c.bodyStyle)),
        prisma.car.findMany({ select: { fuelType: true }, distinct: ['fuelType'] }).then(res => res.map(c => c.fuelType)),
        prisma.car.findMany({ select: { transmission: true }, distinct: ['transmission'] }).then(res => res.map(c => c.transmission)),
        session?.user?.id ? prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wishlist: { select: { id: true } } },
        }) : null
    ]);

    const wishlistedCarIds = user?.wishlist.map(car => car.id) || [];

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Inventory</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">Find the perfect vehicle for you.</p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <FilterSidebar makes={makes} bodyStyles={bodyStyles} fuelTypes={fuelTypes} transmissions={transmissions} />
                </div>

                <div className="lg:col-span-3">
                    {cars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {cars.map((car) => (
                                <CarCard key={car.id} car={car} isWishlisted={wishlistedCarIds.includes(car.id)} />
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