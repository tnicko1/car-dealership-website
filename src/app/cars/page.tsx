import prisma from '@/lib/prisma';
import CarListings from '@/components/CarListings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import SearchBar from '@/components/SearchBar';
import { Prisma } from '@prisma/client';

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

    const [cars, makes, bodyStyles, fuelTypes, transmissions, user] = await Promise.all([
        prisma.car.findMany({
            where: searchFilter,
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
    const filters = { makes, bodyStyles, fuelTypes, transmissions };

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Vehicles</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">
                        {searchQuery ? `Showing results for "${searchQuery}"` : 'Find the perfect vehicle for you.'}
                    </p>
                    <div className="mt-8">
                        <SearchBar />
                    </div>
                </div>
            </section>

            <CarListings initialCars={cars} filters={filters} wishlistedCarIds={wishlistedCarIds} />
        </div>
    );
}
