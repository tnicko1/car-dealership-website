'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

const RangeSlider = ({ min, max, step, name, title, defaultValue, onValueChange }: any) => {
    const [value, setValue] = useState(defaultValue || min);
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
                    setValue(e.target.value);
                    onValueChange(e.target.value, name);
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

export default function FilterSidebar({ makes, bodyStyles, fuelTypes, transmissions }: { makes: string[], bodyStyles: string[], fuelTypes: string[], transmissions: string[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilterChange = useDebouncedCallback((term: string, name: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(name, term);
        } else {
            params.delete(name);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

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
                        onChange={(e) => handleFilterChange(e.target.value, 'make')}
                        defaultValue={searchParams.get('make') || ''}
                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">All Makes</option>
                        {makes.map(make => (
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
                        onChange={(e) => handleFilterChange(e.target.value, 'model')}
                        defaultValue={searchParams.get('model') || ''}
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
                    defaultValue={searchParams.get('maxPrice')}
                    onValueChange={handleFilterChange}
                />

                {/* Year Range Sliders */}
                <div className="grid grid-cols-2 gap-4">
                    <RangeSlider
                        min={1990}
                        max={new Date().getFullYear()}
                        step={1}
                        name="minYear"
                        title="Min Year"
                        defaultValue={searchParams.get('minYear')}
                        onValueChange={handleFilterChange}
                    />
                    <RangeSlider
                        min={1990}
                        max={new Date().getFullYear()}
                        step={1}
                        name="maxYear"
                        title="Max Year"
                        defaultValue={searchParams.get('maxYear')}
                        onValueChange={handleFilterChange}
                    />
                </div>

                {/* Mileage Range Slider */}
                <RangeSlider
                    min={0}
                    max={300000}
                    step={10000}
                    name="maxMileage"
                    title="Max Mileage"
                    defaultValue={searchParams.get('maxMileage')}
                    onValueChange={handleFilterChange}
                />

                {/* Body Style Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body Style</label>
                    <div className="mt-2 space-y-2">
                        {bodyStyles.map(style => (
                            <div key={style} className="flex items-center">
                                <input
                                    id={`bodyStyle-${style}`}
                                    name="bodyStyle"
                                    type="checkbox"
                                    value={style}
                                    onChange={(e) => handleFilterChange(e.target.checked ? e.target.value : '', 'bodyStyle')}
                                    defaultChecked={searchParams.get('bodyStyle') === style}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                        {fuelTypes.map(type => (
                            <div key={type} className="flex items-center">
                                <input
                                    id={`fuelType-${type}`}
                                    name="fuelType"
                                    type="checkbox"
                                    value={type}
                                    onChange={(e) => handleFilterChange(e.target.checked ? e.target.value : '', 'fuelType')}
                                    defaultChecked={searchParams.get('fuelType') === type}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                        {transmissions.map(transmission => (
                            <div key={transmission} className="flex items-center">
                                <input
                                    id={`transmission-${transmission}`}
                                    name="transmission"
                                    type="checkbox"
                                    value={transmission}
                                    onChange={(e) => handleFilterChange(e.target.checked ? e.target.value : '', 'transmission')}
                                    defaultChecked={searchParams.get('transmission') === transmission}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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