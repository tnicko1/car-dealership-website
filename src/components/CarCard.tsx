'use client';

import { useState } from 'react';
import type { CarWithImages } from "@/types/car";
import Link from "next/link";
import Image from "next/image";
import { toggleWishlist } from "@/actions/wishlistActions";
import { useSession } from "next-auth/react";
import { useCompare } from "@/providers/CompareProvider";

export default function CarCard({ car, isWishlisted: initialIsWishlisted }: { car: CarWithImages, isWishlisted?: boolean }) {
    const { data: session } = useSession();
    const { addToCompare } = useCompare();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

    const handleWishlistToggle = async () => {
        if (!session) {
            // Here you might want to trigger a login modal
            alert("Please log in to add items to your wishlist.");
            return;
        }
        // Optimistically update the UI
        setIsWishlisted(prev => !prev);
        try {
            await toggleWishlist(car.id);
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            // Revert the change if the server action fails
            setIsWishlisted(prev => !prev);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 ease-in-out group">
            <div className="relative">
                <div className="relative h-56 w-full">
                    <Image
                        src={car.images[0]?.url || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'}
                        alt={`${car.make} ${car.model}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/ff0000/ffffff?text=Image+Not+Found'; }}
                    />
                </div>
                <div className="absolute top-2 right-2">
                    <button onClick={handleWishlistToggle} className={`p-2 rounded-full transition-colors
                        ${isWishlisted ? 'text-red-500 bg-red-100 dark:bg-gray-700' : 'text-gray-500 bg-white dark:bg-gray-800'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
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
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">{car.bodyStyle}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/cars/${car.id}`} className="block w-full text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                    </Link>
                    <button onClick={() => addToCompare(car)} className="block w-full text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        Compare
                    </button>
                </div>
            </div>
        </div>
    );
}
