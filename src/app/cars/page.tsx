import prisma from '@/lib/prisma';
import CarListings from '@/components/CarListings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import SearchBar from '@/components/SearchBar';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getGeneralColor } from '@/lib/colorUtils';
import { getGeneralMaterial } from '@/lib/materialUtils';
import { allCarFeatures } from '@/lib/carFeatures';

export const dynamic = 'force-dynamic';

type VehiclesPageProps = {
    searchParams: {
        search?: string;
    }
}

export default async function VehiclesPage({ searchParams }: VehiclesPageProps) {
    const session = await getServerSession(authOptions);
    const searchQuery = searchParams.search;

    const searchFilter: Prisma.CarWhereInput = searchQuery ? {
        OR: [
            { make: { contains: searchQuery, mode: 'insensitive' } },
            { model: { contains: searchQuery, mode: 'insensitive' } },
            { bodyStyle: { contains: searchQuery, mode: 'insensitive' } },
            { stockNumber: { contains: searchQuery, mode: 'insensitive' } },
            isNaN(Number(searchQuery)) ? {} : { year: { equals: Number(searchQuery) } },
        ],
    } : {};

    const [
        cars,
        makes,
        bodyStyles,
        fuelTypes,
        transmissions,
        driveWheels,
        wheelTypes,
        dbColors,
        dbInteriorColors,
        dbInteriorMaterials,
        cylinders,
        doors,
        minMaxValues,
        user
    ] = await Promise.all([
        prisma.car.findMany({
            where: searchFilter,
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        }),
        prisma.car.findMany({ select: { make: true }, distinct: ['make'] }).then(res => res.map(c => c.make).sort()),
        prisma.car.findMany({ select: { bodyStyle: true }, distinct: ['bodyStyle'] }).then(res => res.map(c => c.bodyStyle).sort()),
        prisma.car.findMany({ select: { fuelType: true }, distinct: ['fuelType'] }).then(res => res.map(c => c.fuelType).sort()),
        prisma.car.findMany({ select: { transmission: true }, distinct: ['transmission'] }).then(res => res.map(c => c.transmission).sort()),
        prisma.car.findMany({ where: { driveWheels: { not: null } }, select: { driveWheels: true }, distinct: ['driveWheels'] }).then(res => res.map(c => c.driveWheels!).sort()),
        prisma.car.findMany({ where: { wheel: { not: null } }, select: { wheel: true }, distinct: ['wheel'] }).then(res => res.map(c => c.wheel!).sort()),
        prisma.car.findMany({ where: { color: { not: null } }, select: { color: true }, distinct: ['color'] }).then(res => res.map(c => c.color!)),
        prisma.car.findMany({ where: { interiorColor: { not: null } }, select: { interiorColor: true }, distinct: ['interiorColor'] }).then(res => res.map(c => c.interiorColor!)),
        prisma.car.findMany({ where: { interiorMaterial: { not: null } }, select: { interiorMaterial: true }, distinct: ['interiorMaterial'] }).then(res => res.map(c => c.interiorMaterial!)),
        prisma.car.findMany({ where: { cylinders: { not: null } }, select: { cylinders: true }, distinct: ['cylinders'] }).then(res => res.map(c => c.cylinders!.toString()).sort()),
        prisma.car.findMany({ where: { doors: { not: null } }, select: { doors: true }, distinct: ['doors'] }).then(res => res.map(c => c.doors!.toString()).sort()),
        prisma.car.aggregate({
            _max: { price: true, year: true, mileage: true, horsepower: true, topSpeed: true, zeroToSixty: true, engineVolume: true, weight: true },
            _min: { price: true, year: true, mileage: true, horsepower: true, topSpeed: true, zeroToSixty: true, engineVolume: true, weight: true },
        }),
        session?.user?.id ? prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wishlist: { select: { id: true } } },
        }) : null
    ]);

    const colors = [...new Set(dbColors.map(getGeneralColor))].sort();
    const interiorColors = [...new Set(dbInteriorColors.map(getGeneralColor))].sort();
    const interiorMaterials = [...new Set(dbInteriorMaterials.map(getGeneralMaterial))].sort();

    const wishlistedCarIds = user?.wishlist.map(car => car.id) || [];
    const filters = {
        makes, bodyStyles, fuelTypes, transmissions, driveWheels, wheelTypes,
        colors, interiorColors, interiorMaterials, cylinders, doors,
        minMaxValues, features: allCarFeatures
    };

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Vehicles</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">
                        {searchQuery ? `Showing results for "${searchQuery}"` : 'Find the perfect vehicle for you.'}
                    </p>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <SearchBar />
                        {searchQuery && (
                            <Link href="/cars" className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-full hover:bg-red-700 transition-colors" title="Clear search">
                                <X size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <CarListings initialCars={cars} filters={filters} wishlistedCarIds={wishlistedCarIds} />
        </div>
    );
}
