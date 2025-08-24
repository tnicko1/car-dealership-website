'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCar, updateCar } from '@/actions/carActions';
import Image from 'next/image';
import type { CarWithImages } from '@/types/car';
import { featureCategories } from '@/lib/carFeatures';

export default function AdminForm({ car }: { car?: CarWithImages }) {
    const router = useRouter();
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(car?.images?.map(i => i.url) || []);
    const [imagePreviews, setImagePreviews] = useState<string[]>(car?.images?.map(i => i.url) || []);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const tenMB = 10 * 1024 * 1024;

            const validFiles = files.filter(file => {
                if (file.size > tenMB) {
                    setMessage('Each file size cannot exceed 10MB.');
                    setMessageType('error');
                    return false;
                }
                return true;
            });

            setNewImageFiles(prev => [...prev, ...validFiles]);
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
            if (validFiles.length === files.length) {
                setMessage('');
                setMessageType(null);
            }
        }
    };

    const handleRemoveImage = (urlToRemove: string, index: number) => {
        const existingCount = existingImageUrls.length;
        if (index < existingCount) {
            setExistingImageUrls(prev => prev.filter(url => url !== urlToRemove));
        } else {
            const fileIndex = index - existingCount;
            setNewImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }
        setImagePreviews(prev => prev.filter(url => url !== urlToRemove));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setMessageType(null);

        const formData = new FormData(e.currentTarget);
        
        newImageFiles.forEach(file => {
            formData.append('newImages', file);
        });

        existingImageUrls.forEach(url => {
            formData.append('existingImages', url);
        });

        const result = car ? await updateCar(car.id, formData) : await addCar(formData);

        if (result.success) {
            setMessage(car ? 'Car updated successfully!' : 'Car added successfully!');
            setMessageType('success');
            setTimeout(() => router.push('/my-listings'), 1000);
        } else {
            setMessage(result.error || 'An error occurred.');
            setMessageType('error');
        }
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
                <p className={`p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}
            
            {/* Main Details Section */}
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Main Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input id="make" type="text" name="make" defaultValue={car?.make || ''} placeholder="Make" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="model" type="text" name="model" defaultValue={car?.model || ''} placeholder="Model" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="year" type="number" name="year" defaultValue={car?.year || ''} placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="price" type="number" name="price" defaultValue={car?.price || ''} placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="mileage" type="number" name="mileage" defaultValue={car?.mileage || ''} placeholder="Mileage" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="horsepower" type="number" name="horsepower" defaultValue={car?.horsepower || ''} placeholder="Horsepower" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="fuelType" type="text" name="fuelType" defaultValue={car?.fuelType || ''} placeholder="Fuel Type" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="transmission" type="text" name="transmission" defaultValue={car?.transmission || ''} placeholder="Transmission" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="bodyStyle" type="text" name="bodyStyle" defaultValue={car?.bodyStyle || ''} placeholder="Body Style" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>

            {/* Images Section */}
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <input id="images" type="file" name="images" multiple onChange={handleImageChange} className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((url, index) => (
                        <div key={index} className="relative">
                            <Image src={url} alt="Car image" width={200} height={150} className="w-full h-auto rounded" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(url, index)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                                aria-label="Remove image"
                            >
                                &#x2715;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detailed Specifications Section */}
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Detailed Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input id="category" type="text" name="category" defaultValue={car?.category || ''} placeholder="Category (e.g. Sedan)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="engineVolume" type="number" name="engineVolume" defaultValue={car?.engineVolume || ''} placeholder="Engine Volume (L)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="cylinders" type="number" name="cylinders" defaultValue={car?.cylinders || ''} placeholder="Cylinders" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="driveWheels" type="text" name="driveWheels" defaultValue={car?.driveWheels || ''} placeholder="Drive Wheels" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="doors" type="number" name="doors" defaultValue={car?.doors || ''} placeholder="Doors" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="airbags" type="number" name="airbags" defaultValue={car?.airbags || ''} placeholder="Airbags" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="wheel" type="text" name="wheel" defaultValue={car?.wheel || ''} placeholder="Wheel (Left/Right)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="color" type="text" name="color" defaultValue={car?.color || ''} placeholder="Color" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="interiorColor" type="text" name="interiorColor" defaultValue={car?.interiorColor || ''} placeholder="Interior Color" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input id="interiorMaterial" type="text" name="interiorMaterial" defaultValue={car?.interiorMaterial || ''} placeholder="Interior Material" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>

            {/* Vehicle Identification & History */}
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Vehicle Identification & History</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="vin" defaultValue={car?.vin || ''} placeholder="VIN" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="stockNumber" defaultValue={car?.stockNumber || ''} placeholder="Stock Number" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="engineCode" defaultValue={car?.engineCode || ''} placeholder="Engine Code" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="paintCode" defaultValue={car?.paintCode || ''} placeholder="Paint Code" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="url" name="vehicleHistoryUrl" defaultValue={car?.vehicleHistoryUrl || ''} placeholder="Vehicle History Report URL" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600 md:col-span-2" />
                </div>
            </div>

            {/* Performance & Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border rounded-lg dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Performance</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="number" name="topSpeed" defaultValue={car?.topSpeed || ''} placeholder="Top Speed (mph)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="zeroToSixty" defaultValue={car?.zeroToSixty || ''} placeholder="0-60 mph (s)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
                <div className="p-6 border rounded-lg dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Dimensions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="number" name="length" defaultValue={car?.length || ''} placeholder="Length (in)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="width" defaultValue={car?.width || ''} placeholder="Width (in)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="height" defaultValue={car?.height || ''} placeholder="Height (in)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="wheelbase" defaultValue={car?.wheelbase || ''} placeholder="Wheelbase (in)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="cargoCapacity" defaultValue={car?.cargoCapacity || ''} placeholder="Cargo (cu ft)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="groundClearance" defaultValue={car?.groundClearance || ''} placeholder="Clearance (in)" step="0.1" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                        <input type="number" name="weight" defaultValue={car?.weight || ''} placeholder="Weight (lbs)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
            </div>

            {/* Features & Options Section */}
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Features & Options</h2>
                <div className="space-y-6">
                    {Object.entries(featureCategories).map(([category, features]) => (
                        <div key={category}>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{category}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {features.map(feature => (
                                    <label key={feature} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            name="features"
                                            value={feature}
                                            defaultChecked={car?.features?.includes(feature)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        {feature}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <label className="flex items-center gap-2">
                        <input type="checkbox" name="exchange" defaultChecked={car?.exchange || false} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span>Exchange possible</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="technicalInspection" defaultChecked={car?.technicalInspection || false} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span>Technical inspection passed</span>
                    </label>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors disabled:bg-gray-400">
                    {isSubmitting ? 'Saving...' : (car ? 'Update Car' : 'Add Car')}
                </button>
            </div>
        </form>
    );
}
