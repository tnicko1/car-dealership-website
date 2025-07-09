import { addCar, removeCar, updateCar } from '@/actions/carActions';
import prisma from '@/lib/prisma';
import type { Car } from '@prisma/client';

// This component fetches data on the server
export default async function AdminPage() {
    const cars = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

            {/* Add Car Form Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-2xl font-bold mb-4">Add a New Car</h2>
                <AdminForm />
            </div>

            {/* Car List Section */}
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

// Client component for the form
function AdminForm({ car }: { car?: Car }) {
    // Bind the car's ID to the update action if we are editing
    const action = car ? updateCar.bind(null, car.id) : addCar;

    return (
        <form action={action} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="make" defaultValue={car?.make} placeholder="Make (e.g., Toyota)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="model" defaultValue={car?.model} placeholder="Model (e.g., Camry)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="year" defaultValue={car?.year} placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="price" defaultValue={car?.price} placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <input type="text" name="imageUrl" defaultValue={car?.imageUrl} placeholder="Image URL" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <textarea name="description" defaultValue={car?.description} placeholder="Description" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            <input type="text" name="features" defaultValue={car?.features.join(', ')} placeholder="Features (comma-separated)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">{car ? 'Update Car' : 'Add Car'}</button>
            </div>
        </form>
    );
}

// Client component for the list item to handle the remove button
function CarListItem({ car }: { car: Car }) {
    // Bind the car's ID to the remove action
    const removeAction = removeCar.bind(null, car.id);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-24 h-16 object-cover rounded-md" />
                <div>
                    <h3 className="font-bold text-lg">{car.make} {car.model} ({car.year})</h3>
                    <p className="text-blue-600 font-semibold">${car.price.toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* In a real app, an "Edit" button would show the AdminForm with the car's data */}
                <form action={removeAction}>
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                        Remove
                    </button>
                </form>
            </div>
        </div>
    );
}
