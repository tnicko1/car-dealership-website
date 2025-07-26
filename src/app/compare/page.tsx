'use client';

import { useCompare } from '@/providers/CompareProvider';
import Image from 'next/image';

export default function ComparePage() {
    const { compareList } = useCompare();

    if (compareList.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-4xl font-bold">Compare Cars</h1>
                <p className="text-lg text-gray-500 mt-2">You have not selected any cars to compare.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Compare Cars</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {compareList.map(car => (
                    <div key={car.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <div className="relative h-48 w-full mb-4">
                            <Image
                                src={car.images[0]?.url || 'https://placehold.co/300x200/cccccc/ffffff?text=No+Image'}
                                alt={`${car.make} ${car.model}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded"
                            />
                        </div>
                        <h2 className="text-2xl font-bold">{car.year} {car.make} {car.model}</h2>
                        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 mt-2">${car.price.toLocaleString()}</p>
                        <div className="mt-4 space-y-2">
                            <p><strong>Mileage:</strong> {car.mileage.toLocaleString()} mi</p>
                            <p><strong>Fuel Type:</strong> {car.fuelType}</p>
                            <p><strong>Transmission:</strong> {car.transmission}</p>
                            <p><strong>Body Style:</strong> {car.bodyStyle}</p>
                            <p><strong>Engine:</strong> {car.engineVolume}L {car.cylinders}-cyl</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
