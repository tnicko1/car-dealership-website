'use client';

import { useState, useEffect, useRef, MouseEvent } from 'react';
import type { CarWithOwnerAndImages, CarWithImages } from "@/types/car";
import Image from "next/image";
import { Heart, Mail, Phone, User } from 'lucide-react';
import WhatsappIcon from './icons/WhatsappIcon';
import InquiryModal from './InquiryModal';
import FinancingCalculator from './FinancingCalculator';
import { useSession } from 'next-auth/react';
import { toggleWishlist } from '@/actions/wishlistActions';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import SpecTabs from './SpecTabs';
import SimilarCarsSlider from './SimilarCarsSlider';
import TestDriveModal from './TestDriveModal';
import TradeInModal from './TradeInModal';
import OverviewSpecs from './OverviewSpecs';
import { motion } from 'framer-motion';

export default function CarDetailsClient({ car, isWishlisted: initialIsWishlisted, similarCars }: { car: CarWithOwnerAndImages, isWishlisted?: boolean, similarCars: CarWithImages[] }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
    const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
    const [isTradeInModalOpen, setIsTradeInModalOpen] = useState(false);
    const { data: session } = useSession();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [isCtaVisible, setIsCtaVisible] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const imageContainerRef = useRef<HTMLDivElement>(null);
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
    
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setMousePos({ x, y });
    };

    const currentImageUrl = car.images[currentImageIndex]?.url;
    const slides = car.images.map(image => ({
        src: image.url,
        alt: `${car.make} ${car.model}`,
        width: 1200, // Provide a default width
        height: 800, // Provide a default height
    }));

    return (
        <div className="max-w-screen-xl mx-auto">
            {/* Preload images */}
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
                        <div 
                            ref={imageContainerRef}
                            className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden cursor-pointer" 
                            onClick={() => setOpenLightbox(true)}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {car.images.length > 0 ? (
                                <>
                                    <Image
                                        src={currentImageUrl}
                                        alt={`${car.make} ${car.model}`}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        priority
                                    />
                                    <motion.div
                                        className="absolute top-0 left-0 w-48 h-48 rounded-full border-4 border-white shadow-2xl pointer-events-none overflow-hidden"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{
                                            opacity: isHovering ? 1 : 0,
                                            scale: isHovering ? 1 : 0.5,
                                            x: mousePos.x - 96, // Center the loupe on the cursor
                                            y: mousePos.y - 96, // Center the loupe on the cursor
                                        }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    >
                                        <Image
                                            src={currentImageUrl}
                                            alt="Zoomed image"
                                            width={(imageContainerRef.current?.offsetWidth || 0) * 2}
                                            height={(imageContainerRef.current?.offsetHeight || 0) * 2}
                                            style={{
                                                objectFit: 'contain',
                                                position: 'absolute',
                                                top: -mousePos.y * 2 + 96,
                                                left: -mousePos.x * 2 + 96,
                                                maxWidth: 'none',
                                            }}
                                        />
                                    </motion.div>
                                </>
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Seller Information</h2>
                        <div className="bg-gray-100 dark:bg-gray-900/50 p-6 rounded-lg flex items-center gap-6">
                            <div className="relative w-16 h-16">
                                {car.owner.image ? (
                                    <Image
                                        src={car.owner.image}
                                        alt={car.owner.name ?? 'Seller avatar'}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold">{car.owner.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">Private Seller</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={`mailto:${car.owner.email}`} className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors">
                                    <Mail className="w-5 h-5" />
                                </a>
                                {car.owner.phone && (
                                    <>
                                        <a href={`tel:${car.owner.phone}`} className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary hover:text-white transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </a>
                                        <a href={`https://wa.me/${car.owner.phone}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-green-500 hover:text-white transition-colors">
                                            <WhatsappIcon className="w-5 h-5" />
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="p-6 md:p-12 border-t border-gray-200 dark:border-gray-700">
                    <FinancingCalculator price={car.price} />
                </div>
            </div>
            <InquiryModal car={car} isOpen={isInquiryModalOpen} setIsOpen={setIsInquiryModalOpen} />
            <TestDriveModal car={car} isOpen={isTestDriveModalOpen} setIsOpen={setIsTestDriveModalOpen} />
            <TradeInModal carOfInterest={car} isOpen={isTradeInModalOpen} setIsOpen={setIsTradeInModalOpen} />
            <Lightbox
                open={openLightbox}
                close={() => setOpenLightbox(false)}
                slides={slides}
                index={currentImageIndex}
                on={{ view: ({ index }) => setCurrentImageIndex(index) }}
                plugins={[Zoom, Thumbnails]}
                render={{
                    slide: ({ slide }) => (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={slide.src}
                                alt={slide.alt || ''}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="100vw"
                            />
                        </div>
                    ),
                }}
                zoom={{
                    maxZoomPixelRatio: 2,
                    zoomInMultiplier: 1.5,
                }}
                thumbnails={{
                    border: 0,
                    borderRadius: 8,
                    gap: 16,
                    padding: 16,
                }}
            />

            {similarCars.length > 0 && (
                <div className="py-12 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                        You Might Also Like
                    </h2>
                    <SimilarCarsSlider cars={similarCars} />
                </div>
            )}
        </div>
    );
}
