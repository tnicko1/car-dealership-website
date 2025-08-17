'use client';

import useEmblaCarousel from 'embla-carousel-react';
import type { CarWithImages } from '@/types/car';
import CarCard from '@/components/CarCard';

export default function SimilarCarsSlider({ cars }: { cars: CarWithImages[] }) {
    const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' });

    if (cars.length === 0) {
        return null;
    }

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
                {cars.map((car) => (
                    <div key={car.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4">
                        <CarCard car={car} />
                    </div>
                ))}
            </div>
        </div>
    );
}
