'use client';

import { useState } from 'react';
import type { CarWithOwnerAndImages } from "@/types/car";
import Image from "next/image";
import { CheckCircle, Heart } from 'lucide-react';
import InquiryModal from './InquiryModal';
import FinancingCalculator from './FinancingCalculator';
import { useSession } from 'next-auth/react';
import { toggleWishlist } from '@/actions/wishlistActions';

export default function CarDetailsClient({ car, isWishlisted: initialIsWishlisted }: { car: CarWithOwnerAndImages, isWishlisted?: boolean }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

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

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length);
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

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-96 lg:h-auto min-h-[400px]">
                        {car.images.length > 0 ? (
                            <>
                                <Image
                                    src={car.images[currentImageIndex].url}
                                    alt={`${car.make} ${car.model}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x600/ff0000/ffffff?text=Image+Not+Found'; }}
                                />
                                {car.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        <button onClick={handlePrevImage} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity">
                                            &lt;
                                        </button>
                                        <button onClick={handleNextImage} className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity">
                                            &gt;
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                                <p className="text-gray-500">No Image Available</p>
                            </div>
                        )}
                    </div>
                    <div className="p-8 md:p-12 flex flex-col">
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
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors w-full
                                    ${isWishlisted
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                <Heart fill={isWishlisted ? 'currentColor' : 'none'} className="w-5 h-5" />
                                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Detailed Specifications
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                        <div><p className="text-gray-500 dark:text-gray-400">Make</p><p className="font-semibold text-lg">{car.make}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Model</p><p className="font-semibold text-lg">{car.model}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Year</p><p className="font-semibold text-lg">{car.year}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Category</p><p className="font-semibold text-lg">{car.category || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Mileage</p><p className="font-semibold text-lg">{car.mileage.toLocaleString()} mi</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Fuel Type</p><p className="font-semibold text-lg">{car.fuelType}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Engine Volume</p><p className="font-semibold text-lg">{car.engineVolume ? `${car.engineVolume}L` : 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Cylinders</p><p className="font-semibold text-lg">{car.cylinders || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Transmission</p><p className="font-semibold text-lg">{car.transmission}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Drive Wheels</p><p className="font-semibold text-lg">{car.driveWheels || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Doors</p><p className="font-semibold text-lg">{car.doors || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Airbags</p><p className="font-semibold text-lg">{car.airbags || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Wheel</p><p className="font-semibold text-lg">{car.wheel || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Color</p><p className="font-semibold text-lg">{car.color || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Interior Color</p><p className="font-semibold text-lg">{car.interiorColor || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Interior Material</p><p className="font-semibold text-lg">{car.interiorMaterial || 'N/A'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Exchange</p><p className="font-semibold text-lg">{car.exchange ? 'Yes' : 'No'}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Tech Inspection</p><p className="font-semibold text-lg">{car.technicalInspection ? 'Yes' : 'No'}</p></div>
                    </div>
                </div>

                {(car.comfort?.length > 0 || car.safety?.length > 0 || car.multimedia?.length > 0 || car.other?.length > 0) && (
                    <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            General Specifications
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {car.comfort?.length > 0 && renderSpecificationList('Comfort', car.comfort)}
                            {car.safety?.length > 0 && renderSpecificationList('Safety', car.safety)}
                            {car.multimedia?.length > 0 && renderSpecificationList('Multimedia', car.multimedia)}
                            {car.other?.length > 0 && renderSpecificationList('Other', car.other)}
                        </div>
                    </div>
                )}
                <FinancingCalculator price={car.price} />

                {car.owner && (
                    <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Seller Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Name</p>
                                <p className="font-semibold text-lg">{car.owner.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-semibold text-lg">{car.owner.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="font-semibold text-lg">{car.owner.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <InquiryModal car={car} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </>
    );
}
