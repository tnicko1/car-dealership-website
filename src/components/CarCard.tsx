'use client';

import { useState, MouseEvent, useCallback, useEffect } from 'react';
import type { CarWithImages } from "@/types/car";
import Link from "next/link";
import Image from "next/image";
import { toggleWishlist } from "@/actions/wishlistActions";
import { useSession } from "next-auth/react";
import { useCompare } from "@/providers/CompareProvider";
import useEmblaCarousel from 'embla-carousel-react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarCard({ car, isWishlisted: initialIsWishlisted, isInteractive = true }: { car: CarWithImages, isWishlisted?: boolean, isInteractive?: boolean }) {
    const { data: session } = useSession();
    const { addToCompare } = useCompare();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [transform, setTransform] = useState('');
    
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: true, 
        active: isInteractive,
        watchDrag: (emblaApi, event) => {
            if (!isInteractive) return false;
            return (event as PointerEvent).pointerType !== 'mouse';
        }
    });
    const [currentImage, setCurrentImage] = useState(0);

    const scrollPrev = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        emblaApi?.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        emblaApi?.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (emblaApi) {
            setCurrentImage(emblaApi.selectedScrollSnap());
        }
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi || !isInteractive) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect, isInteractive]);

    const handleWishlistToggle = async (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!session) {
            alert("Please log in to add items to your wishlist.");
            return;
        }
        setIsWishlisted(prev => !prev);
        try {
            await toggleWishlist(car.id);
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            setIsWishlisted(prev => !prev);
            alert("Something went wrong. Please try again.");
        }
    };

    const handleCompareClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCompare(car);
    };

    const onMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
        const card = e.currentTarget;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        const rotateX = (y / height) * -3;
        const rotateY = (x / width) * 3;
        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    };

    const onMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
    };

    return (
        <Link
            href={`/cars/${car.id}`}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ transform: transform }}
            className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-200 ease-out group"
        >
            <div className="relative">
                {/* Image Carousel */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {car.images.map((image, index) => (
                            <div className="relative h-56 w-full flex-shrink-0" key={image.id}>
                                <Image
                                    src={image.url || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'}
                                    alt={`${car.make} ${car.model} image ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index === 0}
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/ff0000/ffffff?text=Image+Not+Found'; }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop-only Arrow Controls */}
                {isInteractive && car.images.length > 1 && (
                    <>
                        <button onClick={scrollPrev} className="absolute top-1/2 left-2 z-20 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-all duration-200 opacity-0 md:group-hover:opacity-100 md:flex hidden items-center justify-center">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={scrollNext} className="absolute top-1/2 right-2 z-20 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition-all duration-200 opacity-0 md:group-hover:opacity-100 md:flex hidden items-center justify-center">
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {isInteractive && car.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 flex space-x-2">
                        {car.images.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentImage ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                    </div>
                )}

                <div className="absolute top-2 right-2 z-10">
                    <button onClick={handleWishlistToggle} className={`p-2 rounded-full transition-colors
                        ${isWishlisted ? 'text-red-500 bg-red-100 dark:bg-gray-700' : 'text-gray-500 bg-white dark:bg-gray-800'}`}>
                        <Heart fill={isWishlisted ? 'currentColor' : 'none'} className="w-6 h-6" />
                    </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
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
                    <button onClick={handleCompareClick} className="block w-full text-center bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                        Compare
                    </button>
                </div>
            </div>
        </Link>
    );
}