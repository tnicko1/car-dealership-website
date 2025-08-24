'use client';

import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import CarLogo from './CarLogo';

export default function BrandSelectionModal({ isOpen, onClose, brands, selectedBrands, onBrandChange }: any) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBrands = useMemo(() => {
        return brands.filter((brand: string) => brand.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [brands, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Select Brands</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 border-b dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-gray-900 border-transparent rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredBrands.map((brand: string) => (
                        <div
                            key={brand}
                            onClick={() => onBrandChange(brand, 'make', !selectedBrands.includes(brand))}
                            className={`p-4 border dark:border-gray-700 rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200
                                ${selectedBrands.includes(brand) ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md'}`}
                        >
                            <CarLogo make={brand} className="h-10 w-10" />
                            <span className="text-sm font-medium text-center">{brand}</span>
                        </div>
                    ))}
                </div>
                <div className="p-6 border-t dark:border-gray-700 mt-auto">
                    <button onClick={onClose} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
