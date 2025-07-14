'use client';

import { addCar, removeCar } from '@/actions/carActions';
import { useEffect, useState, useTransition } from 'react';
import type { Car } from '@prisma/client';
import Image from 'next/image'; // Import the Next.js Image component

// We need to fetch cars on the client side now
async function getCars() {
    const res = await fetch('/api/cars');
    if (!res.ok) {
        throw new Error('Failed to fetch cars');
    }
    return res.json();
}


export default function AdminPage() {
    const [cars, setCars] = useState<Car[]>([]);
    // useTransition is a React Hook that lets you update the state without blocking the UI.
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {
            getCars().then(setCars);
        });
    }, []);

    const refreshCars = () => {
        startTransition(() => {
            getCars().then(setCars);
        });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-2xl font-bold mb-4">Add a New Car</h2>
                <AdminForm onCarAdded={refreshCars} />
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Current Inventory</h2>
                <div className={`space-y-4 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                    {cars.map((car) => (
                        <CarListItem key={car.id} car={car} onCarRemoved={refreshCars} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function AdminForm({ onCarAdded }: { onCarAdded: () => void }) {
    const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');

    const handleFormSubmit = async (formData: FormData) => {
        await addCar(formData);
        (document.getElementById('admin-form') as HTMLFormElement).reset();
        onCarAdded();
    }

    return (
        <form id="admin-form" action={handleFormSubmit} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <label className="font-medium">Image Source:</label>
                <button type="button" onClick={() => setImageSource('url')} className={`px-4 py-2 rounded ${imageSource === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>URL</button>
                <button type="button" onClick={() => setImageSource('upload')} className={`px-4 py-2 rounded ${imageSource === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Upload</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="make" placeholder="Make (e.g., Toyota)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="model" placeholder="Model (e.g., Camry)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="year" placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="price" placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>

            {imageSource === 'url' ? (
                <input type="text" name="imageUrl" placeholder="Image URL" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            ) : (
                <input type="file" name="imageFile" accept="image/*" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            )}

            <textarea name="description" placeholder="Description" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            <input type="text" name="features" placeholder="Features (comma-separated)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">Add Car</button>
            </div>
        </form>
    );
}

function CarListItem({ car, onCarRemoved }: { car: Car, onCarRemoved: () => void }) {
    const handleRemove = async () => {
        // A simple confirmation dialog
        if (window.confirm(`Are you sure you want to remove the ${car.year} ${car.make} ${car.model}?`)) {
            await removeCar(car.id);
            onCarRemoved();
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {/* Using the Next.js Image component to fix the warning */}
                <Image
                    src={car.imageUrl}
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
                <button onClick={handleRemove} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                    Remove
                </button>
            </div>
        </div>
    );
}
