'use client';

import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

const RangeSlider = ({ min, max, step, name, title, value: initialValue, onValueChange }: any) => {
    const [value, setValue] = useState(initialValue);
    const debouncedOnChange = useDebouncedCallback(onValueChange, 300);

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{title}</label>
            <input
                type="range"
                id={name}
                name={name}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setValue(newValue);
                    debouncedOnChange(newValue, name);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{min}</span>
                <span>{value}</span>
                <span>{max}</span>
            </div>
        </div>
    )
}

export default function FilterSidebar({ makes, bodyStyles, fuelTypes, transmissions, onFilterChange, initialFilters }: any) {
    const handleInputChange = useDebouncedCallback((value: string, name: string) => {
        onFilterChange(value, name);
    }, 300);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        // Basic logic for single checkbox selection, can be expanded for multi-select
        onFilterChange(e.target.checked ? e.target.value : '', name);
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Filters</h3>
            <div className="space-y-6">
                {/* Make Filter */}
                <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Make</label>
                    <select
                        id="make"
                        name="make"
                        onChange={(e) => onFilterChange(e.target.value, 'make')}
                        defaultValue={initialFilters.make}
                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">All Makes</option>
                        {makes.map((make: string) => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                    </select>
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

                {/* Price Range Slider */}
                <RangeSlider
                    min={0}
                    max={200000}
                    step={1000}
                    name="maxPrice"
                    title="Max Price"
                    value={initialFilters.maxPrice}
                    onValueChange={onFilterChange}
                />

                {/* Year Range Sliders */}
                <div className="grid grid-cols-2 gap-4">
                    <RangeSlider
                        min={1990}
                        max={new Date().getFullYear()}
                        step={1}
                        name="minYear"
                        title="Min Year"
                        value={initialFilters.minYear}
                        onValueChange={onFilterChange}
                    />
                    <RangeSlider
                        min={1990}
                        max={new Date().getFullYear()}
                        step={1}
                        name="maxYear"
                        title="Max Year"
                        value={initialFilters.maxYear}
                        onValueChange={onFilterChange}
                    />
                </div>

                {/* Mileage Range Slider */}
                <RangeSlider
                    min={0}
                    max={300000}
                    step={10000}
                    name="maxMileage"
                    title="Max Mileage"
                    value={initialFilters.maxMileage}
                    onValueChange={onFilterChange}
                />

                {/* Body Style Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body Style</label>
                    <div className="mt-2 space-y-2">
                        {bodyStyles.map((style: string) => (
                            <div key={style} className="flex items-center">
                                <input
                                    id={`bodyStyle-${style}`}
                                    name="bodyStyle"
                                    type="radio" // Changed to radio for single selection
                                    value={style}
                                    onChange={(e) => handleCheckboxChange(e, 'bodyStyle')}
                                    checked={initialFilters.bodyStyle === style}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor={`bodyStyle-${style}`} className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                    {style}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fuel Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fuel Type</label>
                    <div className="mt-2 space-y-2">
                        {fuelTypes.map((type: string) => (
                            <div key={type} className="flex items-center">
                                <input
                                    id={`fuelType-${type}`}
                                    name="fuelType"
                                    type="radio"
                                    value={type}
                                    onChange={(e) => handleCheckboxChange(e, 'fuelType')}
                                    checked={initialFilters.fuelType === type}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor={`fuelType-${type}`} className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transmission Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transmission</label>
                    <div className="mt-2 space-y-2">
                        {transmissions.map((transmission: string) => (
                            <div key={transmission} className="flex items-center">
                                <input
                                    id={`transmission-${transmission}`}
                                    name="transmission"
                                    type="radio"
                                    value={transmission}
                                    onChange={(e) => handleCheckboxChange(e, 'transmission')}
                                    checked={initialFilters.transmission === transmission}
                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor={`transmission-${transmission}`} className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                                    {transmission}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
