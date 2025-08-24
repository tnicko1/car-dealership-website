'use client';

import { useState, useEffect, useRef } from 'react';
import type { CarWithOwnerAndImages, CarWithImages } from "@/types/car";
import Image from "next/image";
import { Heart, Mail, Phone, User } from 'lucide-react';
import InquiryModal from './InquiryModal';
import FinancingCalculator from './FinancingCalculator';
import { useSession } from 'next-auth/react';
import { toggleWishlist } from '@/actions/wishlistActions';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import SpecTabs from './SpecTabs';
import SimilarCarsSlider from './SimilarCarsSlider';
import TestDriveModal from './TestDriveModal';
import TradeInModal from './TradeInModal';
import OverviewSpecs from './OverviewSpecs';

export default function CarDetailsClient({ car, isWishlisted: initialIsWishlisted, similarCars }: { car: CarWithOwnerAndImages, isWishlisted?: boolean, similarCars: CarWithImages[] }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
    const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);
    const { data: session } = useSession();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [isCtaVisible, setIsCtaVisible] = useState(false);

    const ctaTriggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const triggerElement = ctaTriggerRef.current;
        if (!triggerElement || window.innerWidth < 768) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsCtaVisible(!entry.isIntersecting);
            },
            {
                rootMargin: "-150px 0px 0px 0px",
                threshold: 0
            }
        );

        observer.observe(triggerElement);

        return () => {
            if (triggerElement) {
                observer.unobserve(triggerElement);
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
            <div className={`
                hidden md:flex fixed top-[80px] left-0 right-0 z-40 
                bg-white/80 dark:bg-gray-900/80 
                backdrop-blur-sm shadow-md 
                transition-all duration-300 ease-in-out 
                ${isCtaVisible ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible'}
            `}>
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-lg">{car.year} {car.make} {car.model}</h2>
                        <p className="text-primary dark:text-primary-400 font-semibold">${car.price.toLocaleString()}</p>
                    </div>
                    <button onClick={() => setIsInquiryModalOpen(true)} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                        Inquire Now
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 md:pt-8 md:pb-4 md:px-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                {car.year} {car.make} {car.model}
                            </h1>
                            {car.stockNumber && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Stock #: {car.stockNumber}
                                </p>
                            )}
                        </div>
                        <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary-400">
                            ${car.price.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Gallery */}
                    <div className="px-4 pb-4">
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
                                    className={`relative h-20 rounded-md overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image src={image.url} alt={`Thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                           <FinancingCalculator price={car.price} />
                        </div>
                    </div>

                    <div ref={ctaTriggerRef} className="p-6 md:py-4 md:px-12 flex flex-col">
                        <div className="flex-grow">
                            <OverviewSpecs car={car} />
                        </div>
                        <div className="mt-auto pt-6 space-y-4">
                            {car.vehicleHistoryUrl && (
                                <a
                                    href={car.vehicleHistoryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700 w-full"
                                >
                                    View Vehicle History
                                </a>
                            )}
                            <button onClick={() => setIsTestDriveModalOpen(true)} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors w-full">
                                Book Test Drive
                            </button>
                             <button onClick={() => setIsTradeInModalOpen(true)} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full">
                                Value Your Trade-In
                            </button>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => setIsInquiryModalOpen(true)} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors w-full">
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
                </div>

                {/* Tabbed Specifications */}
                <div className="p-6 md:p-12 border-t border-gray-200 dark:border-gray-700">
                    <SpecTabs car={car} />
                </div>

                {car.owner && (
                    <div className="p-6 md:p-12 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Seller Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4">
                                <User className="w-8 h-8 text-primary dark:text-primary-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Name</p>
                                    <p className="text-gray-600 dark:text-gray-300">{car.owner.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-8 h-8 text-primary dark:text-primary-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Email</p>
                                    <a href={`mailto:${car.owner.email}`} className="text-primary dark:text-primary-400 hover:underline break-all">{car.owner.email}</a>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-8 h-8 text-primary dark:text-primary-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold">Phone</p>
                                    <p className="text-gray-600 dark:text-gray-300">{car.owner.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <InquiryModal car={car} isOpen={isInquiryModalOpen} setIsOpen={setIsInquiryModalOpen} />
            <TestDriveModal car={car} isOpen={isTestDriveModalOpen} setIsOpen={setIsTestDriveModalOpen} />
            <TradeInModal carOfInterest={car} isOpen={isTradeInModalOpen} setIsOpen={setIsTradeInModalOpen} />
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
