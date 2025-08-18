import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { removeCar } from '@/actions/carActions';
import { CarWithImages } from '@/types/car';

export default async function MyListingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect('/api/auth/signin');
    }

    const userCars = await prisma.car.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            images: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">My Listings</h1>
                <Link href="/my-listings/add" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    + Add Car
                </Link>
            </div>
            {userCars.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">You haven't listed any cars yet.</p>
                    <Link href="/my-listings/add" className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-500 transition-colors">
                        List Your First Car
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {userCars.map((car: CarWithImages) => (
                        <div key={car.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className="relative h-56 w-full">
                                <Image
                                    src={car.images[0]?.url || 'https://placehold.co/600x400'}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300">${car.price.toLocaleString()}</p>
                                <div className="mt-4 flex gap-4">
                                    <Link href={`/admin/edit/${car.id}`} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                                        Edit
                                    </Link>
                                    <form action={removeCar.bind(null, car.id)}>
                                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
