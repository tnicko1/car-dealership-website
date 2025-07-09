'use client';

// This is the correct, direct way to import the Car type from Prisma.
import type { Car } from "@prisma/client";
import Image from "next/image";

export default function CarDetailsClient({ car }: { car: Car }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-96 lg:h-auto min-h-[300px]">
                    <Image
                        src={car.imageUrl}
                        alt={`${car.make} ${car.model}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/ff0000/ffffff?text=Image+Not+Found'; }}
                    />
                </div>
                <div className="p-8 md:p-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {car.year} {car.make} {car.model}
                    </h1>
                    <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
                        ${car.price.toLocaleString()}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {car.description}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Key Features
                    </h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {/* Add explicit types for the map function parameters */}
                        {car.features.map((feature: string, index: number) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    <div className="mt-8 bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">Interested? Visit Our Showroom!</h3>
                        <p className="text-blue-700 dark:text-blue-300">To purchase this vehicle, please visit our dealership. We accept card payments and offer financing options. Our team is ready to assist you!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
