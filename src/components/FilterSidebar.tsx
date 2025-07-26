'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

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
            <div className="space-y-4">
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

                {/* Price Filter */}
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Min Price</label>
                        <input type="number" id="minPrice" name="minPrice" onChange={(e) => handleFilterChange(e.target.value, 'minPrice')} defaultValue={searchParams.get('minPrice') || ''} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Max Price</label>
                        <input type="number" id="maxPrice" name="maxPrice" onChange={(e) => handleFilterChange(e.target.value, 'maxPrice')} defaultValue={searchParams.get('maxPrice') || ''} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>

                {/* Body Style Filter */}
                <div>
                    <label htmlFor="bodyStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Body Style</label>
                    <select
                        id="bodyStyle"
                        name="bodyStyle"
                        onChange={(e) => handleFilterChange(e.target.value, 'bodyStyle')}
                        defaultValue={searchParams.get('bodyStyle') || ''}
                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">All Body Styles</option>
                        {bodyStyles.map(style => (
                            <option key={style} value={style}>{style}</option>
                        ))}
                    </select>
                </div>

                {/* Fuel Type Filter */}
                <div>
                    <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fuel Type</label>
                    <select
                        id="fuelType"
                        name="fuelType"
                        onChange={(e) => handleFilterChange(e.target.value, 'fuelType')}
                        defaultValue={searchParams.get('fuelType') || ''}
                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">All Fuel Types</option>
                        {fuelTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Transmission Filter */}
                <div>
                    <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Transmission</label>
                    <select
                        id="transmission"
                        name="transmission"
                        onChange={(e) => handleFilterChange(e.target.value, 'transmission')}
                        defaultValue={searchParams.get('transmission') || ''}
                        className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                        <option value="">All Transmissions</option>
                        {transmissions.map(transmission => (
                            <option key={transmission} value={transmission}>{transmission}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

