'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCar, updateCar, verifyCar } from '@/actions/carActions';
import Image from 'next/image';
import type { CarWithImages } from '@/types/car';
import { featureCategories } from '@/lib/carFeatures';
import SelectionModal from '@/components/SelectionModal';
import { carOptions } from '@/lib/carOptions';
import SingleBrandSelectionModal from '@/components/SingleBrandSelectionModal';
import SingleModelSelectionModal from '@/components/SingleModelSelectionModal';
import { decodeVin } from '@/actions/vinActions';
import { Loader } from 'lucide-react';

export default function AdminForm({ car, makes = [] }: { car?: CarWithImages, makes?: string[] }) {
    const router = useRouter();
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        make: car?.make || '',
        model: car?.model || '',
        year: car?.year || '',
        price: car?.price || '',
        mileage: car?.mileage || '',
        horsepower: car?.horsepower || '',
        fuelType: car?.fuelType || '',
        transmission: car?.transmission || '',
        bodyStyle: car?.bodyStyle || '',
        category: car?.category || '',
        engineVolume: car?.engineVolume || '',
        cylinders: car?.cylinders || '',
        driveWheels: car?.driveWheels || '',
        doors: car?.doors || '',
        airbags: car?.airbags || '',
        wheel: car?.wheel || '',
        color: car?.color || '',
        interiorColor: car?.interiorColor || '',
        interiorMaterial: car?.interiorMaterial || '',
        vin: car?.vin || '',
        stockNumber: car?.stockNumber || '',
        engineCode: car?.engineCode || '',
        paintCode: car?.paintCode || '',
        vehicleHistoryUrl: car?.vehicleHistoryUrl || '',
        topSpeed: car?.topSpeed || '',
        zeroToSixty: car?.zeroToSixty || '',
        length: car?.length || '',
        width: car?.width || '',
        height: car?.height || '',
        wheelbase: car?.wheelbase || '',
        cargoCapacity: car?.cargoCapacity || '',
        groundClearance: car?.groundClearance || '',
        weight: car?.weight || '',
    });
    
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>(car?.features || []);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(car?.images?.map(i => i.url) || []);
    const [imagePreviews, setImagePreviews] = useState<string[]>(car?.images?.map(i => i.url) || []);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isFetchingVin, setIsFetchingVin] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectionChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (feature: string) => {
        setSelectedFeatures(prev => 
            prev.includes(feature) 
                ? prev.filter(f => f !== feature) 
                : [...prev, feature]
        );
    };
    
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

        const formPayload = new FormData();
        
        for (const key in formData) {
            const value = formData[key as keyof typeof formData];
            if (value !== null && value !== undefined) {
                formPayload.append(key, String(value));
            }
        }
        
        selectedFeatures.forEach(feature => {
            formPayload.append('features', feature);
        });

        newImageFiles.forEach(file => {
            formPayload.append('newImages', file);
        });

        existingImageUrls.forEach(url => {
            formPayload.append('existingImages', url);
        });

        const result = car ? await updateCar(car.id, formPayload) : await addCar(formPayload);

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

    const handleVerify = async () => {
        if (!car) return;
        setIsVerifying(true);
        setMessage('');
        setMessageType(null);

        const result = await verifyCar(car.id);

        if (result.success) {
            setMessage('Car verified successfully!');
            setMessageType('success');
        } else {
            setMessage(result.error || 'An error occurred during verification.');
            setMessageType('error');
        }
        setIsVerifying(false);
    };

    const handleVinFetch = async () => {
        if (!formData.vin) {
            setMessage('Please enter a VIN to fetch details.');
            setMessageType('error');
            return;
        }
        setIsFetchingVin(true);
        setMessage('');
        setMessageType(null);

        const result = await decodeVin(formData.vin);

        if (result.success && result.data) {
            const carData = result.data;
            setFormData(prev => ({
                ...prev,
                make: carData.make || prev.make,
                model: carData.model || prev.model,
                year: carData.year || prev.year,
                horsepower: carData.horsepower || prev.horsepower,
                cylinders: carData.cylinders || prev.cylinders,
                driveWheels: carData.driveWheels || prev.driveWheels,
                fuelType: carData.fuelType || prev.fuelType,
                transmission: carData.transmission || prev.transmission,
                bodyStyle: carData.bodyStyle || prev.bodyStyle,
                doors: carData.doors || prev.doors,
                engineVolume: carData.engineVolume || prev.engineVolume,
                wheel: carData.wheel || prev.wheel,
            }));
            setSelectedFeatures(prev => [...new Set([...prev, ...carData.features])]);
            setMessage('Successfully fetched car details!');
            setMessageType('success');
        } else {
            setMessage(result.error || 'Failed to fetch details for this VIN.');
            setMessageType('error');
        }
        setIsFetchingVin(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                {message && (
                    <p className={`p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </p>
                )}
                
                {/* Main Details Section */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Main Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button type="button" onClick={() => setIsBrandModalOpen(true)} className="p-2 border rounded w-full text-left">
                            {formData.make || 'Select Make'}
                        </button>
                        <button type="button" onClick={() => setIsModelModalOpen(true)} className="p-2 border rounded w-full text-left" disabled={!formData.make}>
                            {formData.model || 'Select Model'}
                        </button>
                        <input id="year" type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="Year" required className="p-2 border rounded w-full" />
                        <input id="price" type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" required className="p-2 border rounded w-full" />
                        <input id="mileage" type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} placeholder="Mileage" required className="p-2 border rounded w-full" />
                        <input id="horsepower" type="number" name="horsepower" value={formData.horsepower} onChange={handleInputChange} placeholder="Horsepower" required className="p-2 border rounded w-full" />
                        <SelectionModal fieldName="Fuel Type" options={carOptions.fuelType} selectedValue={formData.fuelType} onValueChange={(value) => handleSelectionChange('fuelType', value)} />
                        <SelectionModal fieldName="Transmission" options={carOptions.transmission} selectedValue={formData.transmission} onValueChange={(value) => handleSelectionChange('transmission', value)} />
                        <SelectionModal fieldName="Body Style" options={carOptions.bodyStyle} selectedValue={formData.bodyStyle} onValueChange={(value) => handleSelectionChange('bodyStyle', value)} />
                    </div>
                </div>

                {/* Images Section */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Images</h2>
                    <input id="images" type="file" name="images" multiple onChange={handleImageChange} className="p-2 border rounded w-full" />
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
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Detailed Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SelectionModal fieldName="Category" options={carOptions.category} selectedValue={formData.category} onValueChange={(value) => handleSelectionChange('category', value)} />
                        <input id="engineVolume" type="number" name="engineVolume" value={formData.engineVolume} onChange={handleInputChange} placeholder="Engine Volume (L)" step="0.1" className="p-2 border rounded w-full" />
                        <input id="cylinders" type="number" name="cylinders" value={formData.cylinders} onChange={handleInputChange} placeholder="Cylinders" className="p-2 border rounded w-full" />
                        <SelectionModal fieldName="Drive Wheels" options={carOptions.driveWheels} selectedValue={formData.driveWheels} onValueChange={(value) => handleSelectionChange('driveWheels', value)} />
                        <input id="doors" type="number" name="doors" value={formData.doors} onChange={handleInputChange} placeholder="Doors" className="p-2 border rounded w-full" />
                        <input id="airbags" type="number" name="airbags" value={formData.airbags} onChange={handleInputChange} placeholder="Airbags" className="p-2 border rounded w-full" />
                        <SelectionModal fieldName="Wheel" options={carOptions.wheel} selectedValue={formData.wheel} onValueChange={(value) => handleSelectionChange('wheel', value)} />
                        <SelectionModal fieldName="Color" options={carOptions.color} selectedValue={formData.color} onValueChange={(value) => handleSelectionChange('color', value)} />
                        <SelectionModal fieldName="Interior Color" options={carOptions.interiorColor} selectedValue={formData.interiorColor} onValueChange={(value) => handleSelectionChange('interiorColor', value)} />
                        <input id="interiorMaterial" type="text" name="interiorMaterial" value={formData.interiorMaterial} onChange={handleInputChange} placeholder="Interior Material" className="p-2 border rounded w-full" />
                    </div>
                </div>

                {/* Vehicle Identification & History */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Vehicle Identification & History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <input type="text" name="vin" value={formData.vin} onChange={handleInputChange} placeholder="VIN" className="p-2 border rounded w-full" />
                            </div>
                            <button
                                type="button"
                                onClick={handleVinFetch}
                                disabled={isFetchingVin}
                                className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                            >
                                {isFetchingVin ? <Loader className="animate-spin" /> : 'Fetch Details'}
                            </button>
                        </div>
                        <input type="text" name="stockNumber" value={formData.stockNumber} onChange={handleInputChange} placeholder="Stock Number" className="p-2 border rounded w-full" />
                        <input type="text" name="engineCode" value={formData.engineCode} onChange={handleInputChange} placeholder="Engine Code" className="p-2 border rounded w-full" />
                        <input type="text" name="paintCode" value={formData.paintCode} onChange={handleInputChange} placeholder="Paint Code" className="p-2 border rounded w-full" />
                        <input type="url" name="vehicleHistoryUrl" value={formData.vehicleHistoryUrl} onChange={handleInputChange} placeholder="Vehicle History Report URL" className="p-2 border rounded w-full md:col-span-2" />
                    </div>
                </div>

                {/* Performance & Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Performance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="number" name="topSpeed" value={formData.topSpeed} onChange={handleInputChange} placeholder="Top Speed (mph)" className="p-2 border rounded w-full" />
                            <input type="number" name="zeroToSixty" value={formData.zeroToSixty} onChange={handleInputChange} placeholder="0-60 mph (s)" step="0.1" className="p-2 border rounded w-full" />
                        </div>
                    </div>
                    <div className="p-6 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Dimensions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="number" name="length" value={formData.length} onChange={handleInputChange} placeholder="Length (in)" step="0.1" className="p-2 border rounded w-full" />
                            <input type="number" name="width" value={formData.width} onChange={handleInputChange} placeholder="Width (in)" step="0.1" className="p-2 border rounded w-full" />
                            <input type="number" name="height" value={formData.height} onChange={handleInputChange} placeholder="Height (in)" step="0.1" className="p-2 border rounded w-full" />
                            <input type="number" name="wheelbase" value={formData.wheelbase} onChange={handleInputChange} placeholder="Wheelbase (in)" step="0.1" className="p-2 border rounded w-full" />
                            <input type="number" name="cargoCapacity" value={formData.cargoCapacity} onChange={handleInputChange} placeholder="Cargo (cu ft)" step="0.1" className="p-2 border rounded w-full" />
                            <input type="number" name="groundClearance" value={formData.groundClearance} onChange={handleInputChange} placeholder="Clearance (in)" step="0.1" className="p-2 border rounded w-full" />
                            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="Weight (lbs)" className="p-2 border rounded w-full" />
                        </div>
                    </div>
                </div>

                {/* Features & Options Section */}
                <div className="p-6 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Features & Options</h2>
                    <div className="space-y-6">
                        {Object.entries(featureCategories).map(([category, features]) => (
                            <div key={category}>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {features.map(feature => (
                                        <label key={feature} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <input
                                                type="checkbox"
                                                name="features"
                                                value={feature}
                                                checked={selectedFeatures.includes(feature)}
                                                onChange={() => handleFeatureChange(feature)}
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
                
                <div className="flex justify-end gap-4">
                    {car && (
                        <button 
                            type="button" 
                            onClick={handleVerify}
                            disabled={isVerifying || !!car?.verified} 
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
                        >
                            {isVerifying ? 'Verifying...' : (car.verified ? 'Verified' : 'Verify Listing')}
                        </button>
                    )}
                    <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors disabled:bg-gray-400">
                        {isSubmitting ? 'Saving...' : (car ? 'Update Car' : 'Add Car')}
                    </button>
                </div>
            </form>
            <SingleBrandSelectionModal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                brands={makes}
                selectedValue={formData.make}
                onValueChange={(value) => handleSelectionChange('make', value)}
            />
            <SingleModelSelectionModal
                isOpen={isModelModalOpen}
                onClose={() => setIsModelModalOpen(false)}
                make={formData.make}
                selectedValue={formData.model}
                onValueChange={(value) => handleSelectionChange('model', value)}
            />
        </>
    );
}

