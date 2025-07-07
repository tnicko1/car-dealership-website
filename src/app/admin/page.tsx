'use client';

import { useState } from 'react';
import { Car } from '@/types/car';
import { DUMMY_CARS } from '@/data/dummy-cars'; // In a real app, this would be a database call

export default function AdminPage() {
    // In a real app, you'd fetch this from a database
    const [cars, setCars] = useState<Car[]>(DUMMY_CARS);
    const [editingCar, setEditingCar] = useState<Car | null>(null);

    const handleAddCar = (newCarData: Omit<Car, 'id'>) => {
        // NOTE: In a real application, this would be an API call to your backend to save the new car.
        // The backend would generate a unique ID.
        const newCar: Car = {
            id: crypto.randomUUID(), // Generate a simple unique ID for the client-side demo
            ...newCarData,
        };
        setCars([...cars, newCar]);
        console.log('Added car:', newCar);
        alert('Car added successfully! (Demo only)');
    };

    const handleUpdateCar = (updatedCar: Car) => {
        // NOTE: In a real application, this would be an API call to update the car in the database.
        setCars(cars.map((car) => (car.id === updatedCar.id ? updatedCar : car)));
        setEditingCar(null);
        console.log('Updated car:', updatedCar);
        alert('Car updated successfully! (Demo only)');
    };

    const handleRemoveCar = (id: string) => {
        // NOTE: In a real application, this would be an API call to delete the car.
        if (window.confirm('Are you sure you want to remove this car?')) {
            setCars(cars.filter((car) => car.id !== id));
            console.log('Removed car with id:', id);
            alert('Car removed successfully! (Demo only)');
        }
    };

    const handleEditClick = (car: Car) => {
        setEditingCar(car);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>

            {/* Add/Edit Form Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
                <h2 className="text-2xl font-bold mb-4">{editingCar ? 'Edit Car' : 'Add a New Car'}</h2>
                <AdminForm
                    onSubmit={editingCar ? handleUpdateCar : handleAddCar}
                    initialData={editingCar}
                    onCancel={() => setEditingCar(null)}
                />
            </div>

            {/* Car List Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Current Inventory</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cars.map((car) => (
                        <div key={car.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between">
                            <div>
                                <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover rounded-md mb-4" />
                                <h3 className="font-bold text-lg">{car.make} {car.model} ({car.year})</h3>
                                <p className="text-blue-600 font-semibold">${car.price.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => handleEditClick(car)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                                    aria-label={`Edit ${car.make} ${car.model}`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleRemoveCar(car.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                    aria-label={`Remove ${car.make} ${car.model}`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Reusable Form Component for Admin Panel
interface AdminFormProps {
    onSubmit: (data: any) => void;
    initialData?: Car | null;
    onCancel?: () => void;
}

function AdminForm({ onSubmit, initialData, onCancel }: AdminFormProps) {
    const [formData, setFormData] = useState({
        make: initialData?.make || '',
        model: initialData?.model || '',
        year: initialData?.year || new Date().getFullYear(),
        price: initialData?.price || '',
        imageUrl: initialData?.imageUrl || '',
        description: initialData?.description || '',
        features: initialData?.features.join(', ') || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const carData = {
            ...formData,
            year: Number(formData.year),
            price: Number(formData.price),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        };

        if (initialData) {
            onSubmit({ ...initialData, ...carData });
        } else {
            onSubmit(carData);
        }
        // Reset form if not in edit mode
        if (!initialData) {
            setFormData({
                make: '', model: '', year: new Date().getFullYear(), price: '',
                imageUrl: '', description: '', features: ''
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="make" value={formData.make} onChange={handleChange} placeholder="Make (e.g., Toyota)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model (e.g., Camry)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            <input type="text" name="features" value={formData.features} onChange={handleChange} placeholder="Features (comma-separated, e.g., Bluetooth, Sunroof)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <div className="flex justify-end space-x-4">
                {initialData && onCancel && (
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">Cancel</button>
                )}
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">{initialData ? 'Update Car' : 'Add Car'}</button>
            </div>
        </form>
    );
}
