'use client';

import { useState } from 'react';
import type { Car } from "@prisma/client";
import Image from "next/image";

export default function CarDetailsClient({ car }: { car: Car }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.imageUrls.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.imageUrls.length) % car.imageUrls.length);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-96 lg:h-auto min-h-[300px]">
                    <Image
                        src={car.imageUrls[currentImageIndex]}
                        alt={`${car.make} ${car.model}`}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/ff0000/ffffff?text=Image+Not+Found'; }}
                    />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <button onClick={handlePrevImage} className="bg-black bg-opacity-50 text-white rounded-full p-2">
                            &lt;
                        </button>
                        <button onClick={handleNextImage} className="bg-black bg-opacity-50 text-white rounded-full p-2">
                            &gt;
                        </button>
                    </div>
                </div>
                <div className="p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {car.year} {car.make} {car.model}
                    </h1>
                    <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
                        ${car.price.toLocaleString()}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Mileage</p>
                            <p className="font-semibold text-lg">{car.mileage.toLocaleString()} mi</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Horsepower</p>
                            <p className="font-semibold text-lg">{car.horsepower} hp</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Fuel Type</p>
                            <p className="font-semibold text-lg">{car.fuelType}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Transmission</p>
                            <p className="font-semibold text-lg">{car.transmission}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">Body Style</p>
                            <p className="font-semibold text-lg">{car.bodyStyle}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {car.description}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Key Features
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {car.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <div className="mt-8 flex gap-4">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Inquire Now
                        </button>
                        <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
