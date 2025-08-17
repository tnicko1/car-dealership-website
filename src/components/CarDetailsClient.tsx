'use client';

import { useState, useEffect, useRef } from 'react';
import type { CarWithOwnerAndImages } from "@/types/car";
import Image from "next/image";
import { CheckCircle, Heart } from 'lucide-react';
import InquiryModal from './InquiryModal';
import FinancingCalculator from './FinancingCalculator';
import { useSession } from 'next-auth/react';
import { toggleWishlist } from '@/actions/wishlistActions';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SpecTabs from './SpecTabs';
import SimilarCarsSlider from './SimilarCarsSlider';

export default function CarDetailsClient({ car, isWishlisted: initialIsWishlisted, similarCars }: { car: CarWithOwnerAndImages, isWishlisted?: boolean, similarCars: CarWithImages[] }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [isCtaVisible, setIsCtaVisible] = useState(false);

    const ctaTriggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When the trigger element is NOT intersecting (i.e., scrolled past), show the CTA bar.
                setIsCtaVisible(!entry.isIntersecting);
            },
            { rootMargin: "-100px 0px 0px 0px" } // Trigger when the element is 100px from the top
        );

        if (ctaTriggerRef.current) {
            observer.observe(ctaTriggerRef.current);
        }

        return () => {
            if (ctaTriggerRef.current) {
                observer.unobserve(ctaTriggerRef.current);
            }
        };
    }, []);

    const handleWishlistToggle = async () => {
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

    const renderSpecificationList = (title: string, items: string[]) => (
        <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    const slides = car.images.map(img => ({ src: img.url }));

    return (
        <>
            {/* Preload images (already implemented) */}
            <div style={{ display: 'none' }}>
                {car.images.map(image => (
                    <Image key={`preload-${image.id}`} src={image.url} alt="preload" width={800} height={600} priority={false} />
                ))}
            </div>

            {/* Sticky CTA Bar */}
            <div className={`sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md transition-transform duration-300 ${isCtaVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-lg">{car.year} {car.make} {car.model}</h2>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">${car.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Inquire Now
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="p-4">
                        <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden cursor-pointer" onClick={() => setOpenLightbox(true)}>
                            {car.images.length > 0 ? (
                                <Image
                                    src={car.images[currentImageIndex].url}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                                    <p className="text-gray-500">No Image Available</p>
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                            {car.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className={`relative h-20 rounded-md overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-600' : 'border-transparent'}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div ref={ctaTriggerRef} className="p-8 md:p-12 flex flex-col">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {car.year} {car.make} {car.model}
                        </h1>
                        <p className="text-3xl font-semibold text-blue-600 dark:text-blue-400 mb-6">
                            ${car.price.toLocaleString()}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
                            {car.description}
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full">
                                Inquire Now
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors w-full ${isWishlisted ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                <Heart fill={isWishlisted ? 'currentColor' : 'none'} className="w-5 h-5" />
                                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabbed Specifications */}
                <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700">
                    <SpecTabs car={car} />
                </div>

                <FinancingCalculator price={car.price} />
                {car.owner && (
                    <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Seller Information</h2>
                        {/* ... seller info ... */}
                    </div>
                )}
            </div>
            <InquiryModal car={car} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={slides}
                index={currentImageIndex}
            />

            {similarCars.length > 0 && (
                <div className="py-12 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                        You Might Also Like
                    </h2>
                    <SimilarCarsSlider cars={similarCars} />
                </div>
            )}
        </>
    );
}
