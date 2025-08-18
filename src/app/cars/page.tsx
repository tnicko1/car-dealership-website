import prisma from '@/lib/prisma';
import CarListings from '@/components/CarListings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const session = await getServerSession(authOptions);

    const [cars, makes, bodyStyles, fuelTypes, transmissions, user] = await Promise.all([
        prisma.car.findMany({
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
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Our Inventory</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">Find the perfect vehicle for you.</p>
                </div>
            </section>

            <CarListings initialCars={cars} filters={filters} wishlistedCarIds={wishlistedCarIds} />
        </div>
    );
}
