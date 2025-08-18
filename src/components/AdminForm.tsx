'use client';

import { useState } from 'react';
import { addCar, updateCar } from '@/actions/carActions';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import type { CarWithImages } from '@/types/car';

// This form now handles both creating and updating cars
export default function AdminForm({ car }: { car?: CarWithImages }) {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>(car?.images?.map(i => i.url) || []);
    const [draggedImage, setDraggedImage] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    // Function to handle removing an image URL
    const handleRemoveImage = (urlToRemove: string) => {
        setImageUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    };

    const handleDragStart = (url: string) => {
        setDraggedImage(url);
    };

    const handleDrop = (targetUrl: string) => {
        if (!draggedImage) return;

        const newImageUrls = [...imageUrls];
        const draggedIndex = newImageUrls.findIndex(url => url === draggedImage);
        const targetIndex = newImageUrls.findIndex(url => url === targetUrl);

        // Swap the images
        [newImageUrls[draggedIndex], newImageUrls[targetIndex]] = [newImageUrls[targetIndex], newImageUrls[draggedIndex]];

        setImageUrls(newImageUrls);
        setDraggedImage(null);
    };


    // Determine which server action to call based on whether a car object was passed
    const action = async (formData: FormData) => {
        const uploadedImageUrls = [...imageUrls];
        for (const file of imageFiles) {
            const { data, error } = await supabase.storage
                .from('car-images')
                .upload(`${Date.now()}-${file.name}`, file);

            if (error) {
                console.error('Error uploading image:', error);
                // Handle error appropriately
                return;
            }
            
            const { publicUrl } = supabase.storage.from('car-images').getPublicUrl(data.path).data;
            uploadedImageUrls.push(publicUrl);
        }
        
        // remove existing images
        formData.delete('images');
        
        // Add the new image URLs to the form data
        uploadedImageUrls.forEach(url => {
            formData.append('images', url);
        });

        if (car) {
            await updateCar(car.id, formData);
        } else {
            await addCar(formData);
        }
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const tenMB = 10 * 1024 * 1024; // Size in bytes

            for (const file of files) {
                if (file.size > tenMB) {
                    setMessage('Each file size cannot exceed 10MB.');
                    setMessageType('error');
                    return; // Stop the function if a file is too large
                }
            }

            setImageFiles(files);
            setMessage(''); // Clear previous messages
            setMessageType(null);
        }
    };

    return (
        <form action={action} className="space-y-8">
            {message && (
                <p className={`p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}
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

            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <input type="file" name="images" multiple onChange={handleImageFileChange} className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                        <div
                            key={index}
                            className={`relative cursor-grab transition-all duration-300 ease-in-out transform hover:scale-105
                                ${draggedImage === url ? 'opacity-50 scale-110 shadow-2xl z-20' : 'hover:shadow-lg'}`}
                            draggable
                            onDragStart={() => handleDragStart(url)}
                            onDragOver={(e) => {
                                e.preventDefault();
                                const target = e.currentTarget;
                                if (draggedImage && draggedImage !== url) {
                                    target.classList.add('bg-blue-100', 'dark:bg-blue-900/50', 'rounded-lg');
                                }
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.classList.remove('bg-blue-100', 'dark:bg-blue-900/50', 'rounded-lg');
                            }}
                            onDrop={(e) => {
                                e.currentTarget.classList.remove('bg-blue-100', 'dark:bg-blue-900/50', 'rounded-lg');
                                handleDrop(url);
                            }}
                            onDragEnd={() => setDraggedImage(null)}
                        >
                            <Image src={url} alt="Car image" width={200} height={150} className="w-full h-auto rounded pointer-events-none" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(url)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs leading-none hover:bg-red-700 z-10"
                                aria-label="Remove image"
                            >
                                &#x2715;
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Detailed Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" name="category" defaultValue={car?.category || ''} placeholder="Category" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="engineVolume" step="0.1" defaultValue={car?.engineVolume || ''} placeholder="Engine Volume" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="cylinders" defaultValue={car?.cylinders || ''} placeholder="Cylinders" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="driveWheels" defaultValue={car?.driveWheels || ''} placeholder="Drive Wheels" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="doors" defaultValue={car?.doors || ''} placeholder="Doors" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="number" name="airbags" defaultValue={car?.airbags || ''} placeholder="Airbags" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="wheel" defaultValue={car?.wheel || ''} placeholder="Wheel" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="color" defaultValue={car?.color || ''} placeholder="Color" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="interiorColor" defaultValue={car?.interiorColor || ''} placeholder="Interior Color" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <input type="text" name="interiorMaterial" defaultValue={car?.interiorMaterial || ''} placeholder="Interior Material" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    <div className="flex items-center">
                        <input type="checkbox" name="exchange" defaultChecked={car?.exchange || false} className="mr-2" />
                        <label>Exchange</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="technicalInspection" defaultChecked={car?.technicalInspection || false} className="mr-2" />
                        <label>Technical Inspection</label>
                    </div>
                </div>
            </div>

            <div className="p-6 border rounded-lg dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">General Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 className="font-semibold">Comfort</h3>
                        <input type="text" name="comfort" defaultValue={car?.comfort?.join(', ')} placeholder="Comfort features (comma-separated)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Safety</h3>
                        <input type="text" name="safety" defaultValue={car?.safety?.join(', ')} placeholder="Safety features (comma-separated)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Multimedia</h3>
                        <input type="text" name="multimedia" defaultValue={car?.multimedia?.join(', ')} placeholder="Multimedia features (comma-separated)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Other</h3>
                        <input type="text" name="other" defaultValue={car?.other?.join(', ')} placeholder="Other features (comma-separated)" className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
            </div>

            <textarea name="description" defaultValue={car?.description} placeholder="Description" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            
            <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                    {car ? 'Update Car' : 'Add Car'}
                </button>
            </div>
        </form>
    );
}
