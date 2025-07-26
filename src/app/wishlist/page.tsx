import prisma from '@/lib/prisma';
import CarCard from "@/components/CarCard";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center">My Wishlist</h1>
                <p className="text-lg text-center text-gray-500 mt-2">Please log in to see your wishlist.</p>
            </div>
        );
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { wishlist: true },
    });

    const cars = user?.wishlist || [];

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">My Wishlist</h1>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12">
                {cars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {cars.map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 mt-2">Start adding cars to your wishlist to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
