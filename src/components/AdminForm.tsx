'use client';

import { useState } from 'react';
import type { Car } from '@prisma/client';
import { addCar, updateCar } from '@/actions/carActions';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// This form now handles both creating and updating cars
export default function AdminForm({ car }: { car?: Car }) {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageUrls, setImageUrl] = useState<string[]>(car?.images?.map(i => i.url) || []);

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
            setImageFiles(Array.from(e.target.files));
        }
    };

    return (
        <form action={action} className="space-y-8">
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
        <div key={index} className="relative">
            <Image src={url} alt="Car image" width={200} height={150} className="w-full h-auto rounded" />
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