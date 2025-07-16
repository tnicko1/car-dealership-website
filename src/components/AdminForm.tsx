'use client';

import { useState } from 'react';
import type { Car } from '@prisma/client';
import { addCar, updateCar } from '@/actions/carActions';

// This form now handles both creating and updating cars
export default function AdminForm({ car }: { car?: Car }) {
    const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');

    // Determine which server action to call based on whether a car object was passed
    const action = car ? updateCar.bind(null, car.id) : addCar;

    return (
        <form action={action} className="space-y-4">
            {/* Image Source Toggle */}
            <div className="flex items-center gap-4 mb-4">
                <label className="font-medium">Image Source:</label>
                <button type="button" onClick={() => setImageSource('url')} className={`px-4 py-2 rounded ${imageSource === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>URL</button>
                <button type="button" onClick={() => setImageSource('upload')} className={`px-4 py-2 rounded ${imageSource === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Upload</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="make" defaultValue={car?.make} placeholder="Make" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="model" defaultValue={car?.model} placeholder="Model" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="year" defaultValue={car?.year} placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="price" defaultValue={car?.price} placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>

            {imageSource === 'url' ? (
                <input type="text" name="imageUrl" defaultValue={car?.imageUrl} placeholder="Image URL" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            ) : (
                <input type="file" name="imageFile" accept="image/*" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            )}

            <textarea name="description" defaultValue={car?.description} placeholder="Description" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            <input type="text" name="features" defaultValue={car?.features.join(', ')} placeholder="Features (comma-separated)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />

            <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                    {car ? 'Update Car' : 'Add Car'}
                </button>
            </div>
        </form>
    );
}
