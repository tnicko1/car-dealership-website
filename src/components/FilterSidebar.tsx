'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function FilterSidebar({ makes }: { makes: string[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // useDebouncedCallback prevents the URL from updating on every single keystroke
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
            </div>
        </div>
    );
}
