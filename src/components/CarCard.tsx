'use client';

import type { Car } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function CarCard({ car }: { car: Car }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 ease-in-out group">
            <div className="relative">
                <div className="relative h-56 w-full">
                    <Image
                        src={car.imageUrl}
                        alt={`${car.make} ${car.model}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/ff0000/ffffff?text=Image+Not+Found'; }}
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white">
                        {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-300">{car.year}</p>
                </div>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                        ${car.price.toLocaleString()}
                    </p>
                    <div className="flex space-x-2">
                        {car.features.slice(0, 2).map(feature => (
                            <span key={feature} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">{feature}</span>
                        ))}
                    </div>
                </div>
                <Link href={`/cars/${car.id}`} aria-label={`View details for ${car.make} ${car.model}`} className="block w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                </Link>
            </div>
        </div>
    );
}
