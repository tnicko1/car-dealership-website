import { removeCar } from '@/actions/carActions';
import prisma from '@/lib/prisma';
import type { CarWithImages } from '@/types/car';
import Image from 'next/image';
import Link from 'next/link';
import AdminForm from '@/components/AdminForm';

export default async function AdminPage() {
    let cars: CarWithImages[] = [];
    try {
        cars = await prisma.car.findMany({
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        });
    } catch (error) {
        console.error("Failed to fetch cars for admin page:", error);
        // You might want to render an error message to the user
        // For now, we'll just log it and show an empty list.
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-2xl font-bold mb-4">Add a New Car</h2>
                <AdminForm />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Current Inventory</h2>
                <div className="space-y-4">
                    {cars.map((car) => (
                        <CarListItem key={car.id} car={car} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CarListItem({ car }: { car: CarWithImages }) {
    const removeAction = removeCar.bind(null, car.id);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image
                    src={car.images[0]?.url || 'https://placehold.co/100x75/cccccc/ffffff?text=No+Image'}
                    alt={`${car.make} ${car.model}`}
                    width={96}
                    height={64}
                    className="w-24 h-16 object-cover rounded-md"
                />
                <div>
                    <h3 className="font-bold text-lg">{car.make} {car.model} ({car.year})</h3>
                    <p className="text-blue-600 font-semibold">${car.price.toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* Link to the new edit page */}
                <Link href={`/admin/edit/${car.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors">
                    Edit
                </Link>
                <form action={removeAction}>
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Remove
                    </button>
                </form>
            </div>
        </div>
    );
}
