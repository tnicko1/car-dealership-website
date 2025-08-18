'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCar, updateCar } from '@/actions/carActions';
import Image from 'next/image';
import type { CarWithImages } from '@/types/car';

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
            // This is an existing image, remove its URL
            setExistingImageUrls(prev => prev.filter(url => url !== urlToRemove));
        } else {
            // This is a new file, remove it from the files array
            const fileIndex = index - existingCount;
            setNewImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }
        // Always remove from the combined preview array
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
            // Redirect after a short delay to allow the user to see the message
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
                    <input type="text" name="make" defaultValue={car?.make} placeholder="Make" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="model" defaultValue={car?.model} placeholder="Model" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="year" defaultValue={car?.year} placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="price" defaultValue={car?.price} placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="mileage" defaultValue={car?.mileage} placeholder="Mileage" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="horsepower" defaultValue={car?.horsepower} placeholder="Horsepower" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="fuelType" defaultValue={car?.fuelType} placeholder="Fuel Type" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="transmission" defaultValue={car?.transmission} placeholder="Transmission" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="bodyStyle" defaultValue={car?.bodyStyle} placeholder="Body Style" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>

            {/* Images Section */}
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <input type="file" name="images" multiple onChange={handleImageChange} className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((url, index) => (
                        <div key={index} className="relative">
                            <Image src={url} alt="Car image" width={200} height={150} className="w-full h-auto rounded" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(url, index)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                            >
                                &#x2715;
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Other sections... */}
            <textarea name="description" defaultValue={car?.description} placeholder="Description" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            
            <div className="flex justify-end">
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                    {isSubmitting ? 'Saving...' : (car ? 'Update Car' : 'Add Car')}
                </button>
            </div>
        </form>
    );
}
