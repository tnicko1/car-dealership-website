'use client';

import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { CarWithImages } from '@/types/car';
import CarCard from '@/components/CarCard';

// Skeleton component for loading state
const CarCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="relative h-56 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="p-6">
            <div className="h-6 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-1/4 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-1/2 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
    </div>
);

export default function FeaturedSlider({ cars, wishlistedCarIds }: { cars: CarWithImages[], wishlistedCarIds: string[] }) {
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 5000 })]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay to show skeleton
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <CarCardSkeleton />
                <CarCardSkeleton />
                <CarCardSkeleton />
            </div>
        );
    }

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
                {cars.map((car) => (
                    <div key={car.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4">
                        <CarCard car={car} isWishlisted={wishlistedCarIds.includes(car.id)} isInteractive={false} />
                    </div>
                ))}
            </div>
        </div>
    );
}
