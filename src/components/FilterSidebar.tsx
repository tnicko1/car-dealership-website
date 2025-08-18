'use client';

import { useDebouncedCallback } from 'use-debounce';

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

const CheckboxGroup = ({ name, title, options, value, onValueChange }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{title}</label>
        <div className="mt-2 space-y-2">
            {options.map((option: string) => (
                <div key={option} className="flex items-center">
                    <input
                        id={`${name}-${option}`}
                        name={name}
                        type="checkbox"
                        value={option}
                        checked={value.includes(option)}
                        onChange={(e) => onValueChange(e.target.value, name, e.target.checked)}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor={`${name}-${option}`} className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                        {option}
                    </label>
                </div>
            ))}
        </div>
    </div>
);

export default function FilterSidebar({ makes, bodyStyles, fuelTypes, transmissions, onFilterChange, initialFilters, onReset }: any) {
    const handleInputChange = useDebouncedCallback((value: string, name: string) => {
        onFilterChange(value, name);
    }, 300);

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={onReset} className="text-sm text-primary hover:underline">Reset</button>
            </div>
            <div className="space-y-6">
                {/* Make Filter */}
                <CheckboxGroup
                    name="make"
                    title="Make"
                    options={makes}
                    value={initialFilters.make || []}
                    onValueChange={onFilterChange}
                />

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
                <CheckboxGroup
                    name="bodyStyle"
                    title="Body Style"
                    options={bodyStyles}
                    value={initialFilters.bodyStyle || []}
                    onValueChange={onFilterChange}
                />

                {/* Fuel Type Filter */}
                <CheckboxGroup
                    name="fuelType"
                    title="Fuel Type"
                    options={fuelTypes}
                    value={initialFilters.fuelType || []}
                    onValueChange={onFilterChange}
                />

                {/* Transmission Filter */}
                <CheckboxGroup
                    name="transmission"
                    title="Transmission"
                    options={transmissions}
                    value={initialFilters.transmission || []}
                    onValueChange={onFilterChange}
                />
            </div>
        </div>
    );
}
