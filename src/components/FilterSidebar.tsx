'use client';

import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import BrandSelectionModal from './BrandSelectionModal';
import ModernCheckboxGroup from './ModernCheckboxGroup';
import { SlidersHorizontal } from 'lucide-react';

const RangeInput = ({ name, title, value, onValueChange }: any) => {
    const debouncedOnChange = useDebouncedCallback(onValueChange, 300);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{title}</label>
            <div className="flex gap-2 mt-1">
                <input
                    type="number"
                    name={`min${name}`}
                    placeholder="Min"
                    defaultValue={value.min}
                    onChange={(e) => debouncedOnChange(e.target.value, `min${name}`)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <input
                    type="number"
                    name={`max${name}`}
                    placeholder="Max"
                    defaultValue={value.max}
                    onChange={(e) => debouncedOnChange(e.target.value, `max${name}`)}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
        </div>
    );
};

export default function FilterSidebar({ makes, bodyStyles, fuelTypes, transmissions, onFilterChange, initialFilters, onReset }: any) {
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const handleInputChange = useDebouncedCallback((value: string, name: string) => {
        onFilterChange(value, name);
    }, 300);

    const selectedMakes = initialFilters.make || [];

    return (
        <>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <SlidersHorizontal size={20} />
                        Filters
                    </h3>
                    <button onClick={onReset} className="text-sm text-primary hover:underline">Reset</button>
                </div>
                <div className="space-y-6">
                    {/* Make Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Make</label>
                        <button
                            onClick={() => setIsBrandModalOpen(true)}
                            className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span>{selectedMakes.length > 0 ? `${selectedMakes.length} selected` : 'All Brands'}</span>
                            <span className="text-primary font-semibold">Change</span>
                        </button>
                    </div>

                    {/* Model Filter */}
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Model</label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            onChange={(e) => handleInputChange(e.target.value, 'model')}
                            defaultValue={initialFilters.model}
                            placeholder="e.g., Camry"
                            className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    {/* Price Range */}
                    <RangeInput
                        name="Price"
                        title="Price Range"
                        value={{ min: initialFilters.minPrice, max: initialFilters.maxPrice }}
                        onValueChange={onFilterChange}
                    />

                    {/* Year Range */}
                    <RangeInput
                        name="Year"
                        title="Year Range"
                        value={{ min: initialFilters.minYear, max: initialFilters.maxYear }}
                        onValueChange={onFilterChange}
                    />

                    {/* Mileage Range */}
                    <RangeInput
                        name="Mileage"
                        title="Mileage Range"
                        value={{ min: initialFilters.minMileage, max: initialFilters.maxMileage }}
                        onValueChange={onFilterChange}
                    />

                    {/* Body Style Filter */}
                    <ModernCheckboxGroup
                        name="bodyStyle"
                        title="Body Style"
                        options={bodyStyles}
                        value={initialFilters.bodyStyle || []}
                        onValueChange={onFilterChange}
                    />

                    {/* Fuel Type Filter */}
                    <ModernCheckboxGroup
                        name="fuelType"
                        title="Fuel Type"
                        options={fuelTypes}
                        value={initialFilters.fuelType || []}
                        onValueChange={onFilterChange}
                    />

                    {/* Transmission Filter */}
                    <ModernCheckboxGroup
                        name="transmission"
                        title="Transmission"
                        options={transmissions}
                        value={initialFilters.transmission || []}
                        onValueChange={onFilterChange}
                    />
                </div>
            </div>
            <BrandSelectionModal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                brands={makes}
                selectedBrands={selectedMakes}
                onBrandChange={onFilterChange}
            />
        </>
    );
}
