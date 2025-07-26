'use client';

import { useState } from 'react';
import type { Car } from '@prisma/client';
import { addCar, updateCar } from '@/actions/carActions';

// This form now handles both creating and updating cars
export default function AdminForm({ car }: { car?: Car }) {
    const [imageUrls, setImageUrls] = useState<string[]>(car?.imageUrls || ['']);

    // Determine which server action to call based on whether a car object was passed
    const action = car ? updateCar.bind(null, car.id) : addCar;

    const handleAddImageUrl = () => {
        setImageUrls([...imageUrls, '']);
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);
    };

    return (
        <form action={action} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="make" defaultValue={car?.make} placeholder="Make" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="model" defaultValue={car?.model} placeholder="Model" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="year" defaultValue={car?.year} placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="price" defaultValue={car?.price} placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="mileage" defaultValue={car?.mileage} placeholder="Mileage" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="horsepower" defaultValue={car?.horsepower} placeholder="Horsepower" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="fuelType" defaultValue={car?.fuelType} placeholder="Fuel Type" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="transmission" defaultValue={car?.transmission} placeholder="Transmission" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="bodyStyle" defaultValue={car?.bodyStyle} placeholder="Body Style" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>

            <div>
                <label className="font-medium">Image URLs:</label>
                {imageUrls.map((url, index) => (
                    <input
                        key={index}
                        type="text"
                        name={`imageUrls[${index}]`}
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        placeholder="Image URL"
                        className="p-2 border rounded w-full mt-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                ))}
                <button type="button" onClick={handleAddImageUrl} className="mt-2 px-4 py-2 rounded bg-blue-600 text-white">
                    Add Image
                </button>
            </div>

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
