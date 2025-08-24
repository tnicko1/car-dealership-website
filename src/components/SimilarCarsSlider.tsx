'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { CarWithImages } from '@/types/car';
import CarCard from '@/components/CarCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PrevButton = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
    <button
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow-md disabled:opacity-50"
        onClick={onClick}
        disabled={!enabled}
    >
        <ChevronLeft className="w-6 h-6" />
    </button>
);

const NextButton = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
    <button
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow-md disabled:opacity-50"
        onClick={onClick}
        disabled={!enabled}
    >
        <ChevronRight className="w-6 h-6" />
    </button>
);

export default function SimilarCarsSlider({ cars }: { cars: CarWithImages[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    if (cars.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {cars.map((car) => (
                        <div key={car.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4">
                            <CarCard car={car} />
                        </div>
                    ))}
                </div>
            </div>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
    );
}
