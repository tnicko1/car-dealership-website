'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import BrandSelectionModal from './BrandSelectionModal';
import MoreFiltersModal from './MoreFiltersModal';
import ModelSelectionModal from './ModelSelectionModal';
import YearRangePicker from './YearRangePicker';
import RangePicker from './RangePicker';

export default function FilterBar({ filters, modelsByMake, onFilterChange, initialFilters, onReset }: any) {
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
    const [isMoreFiltersModalOpen, setIsMoreFiltersModalOpen] = useState(false);

    const selectedMakesCount = initialFilters.make?.length || 0;
    const selectedModelsCount = initialFilters.model?.length || 0;
    
    const activeFilterCount = Object.entries(initialFilters).filter(([key, v]) => {
        if (['make', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear', 'minMileage', 'maxMileage'].includes(key)) return false;
        if (typeof v === 'boolean') return v;
        return Array.isArray(v) ? v.length > 0 : v !== '';
    }).length;

    const pricePresets = [
        { label: 'Under $10k', min: '', max: '10000' },
        { label: '$10k - $20k', min: '10000', max: '20000' },
        { label: '$20k - $30k', min: '20000', max: '30000' },
        { label: '$30k - $50k', min: '30000', max: '50000' },
        { label: '$50k - $100k', min: '50000', max: '100000' },
        { label: '$100k+', min: '100000', max: '' },
    ];

    const mileagePresets = [
        { label: 'Under 25k', min: '', max: '25000' },
        { label: '25k - 50k', min: '25000', max: '50000' },
        { label: '50k - 75k', min: '50000', max: '75000' },
        { label: '75k - 100k', min: '75000', max: '100000' },
        { label: '100k - 150k', min: '100000', max: '150000' },
        { label: '150k+', min: '150000', max: '' },
    ];

    return (
        <>
            <div className="p-4 bg-white rounded-lg shadow-md mb-8 sticky top-24 z-30">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Make */}
                    <div className="flex-1 min-w-[150px]">
                        <button
                            onClick={() => setIsBrandModalOpen(true)}
                            className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <p className="text-xs text-gray-500">Make</p>
                            <p className="font-semibold">{selectedMakesCount > 0 ? `${selectedMakesCount} selected` : 'All Brands'}</p>
                        </button>
                    </div>

                    {/* Model */}
                    <div className="flex-1 min-w-[150px]">
                        <button
                            onClick={() => setIsModelModalOpen(true)}
                            className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedMakesCount === 0}
                        >
                            <p className="text-xs text-gray-500">Model</p>
                            <p className="font-semibold">{selectedModelsCount > 0 ? `${selectedModelsCount} selected` : 'All Models'}</p>
                        </button>
                    </div>

                    {/* Price Range */}
                    <div className="flex-1 min-w-[150px]">
                        <RangePicker
                            value={{ min: initialFilters.minPrice, max: initialFilters.maxPrice }}
                            onChange={onFilterChange}
                            title="Price"
                            minName="minPrice"
                            maxName="maxPrice"
                            presets={pricePresets}
                            defaultLabel="Any Price"
                        />
                    </div>

                    {/* Year Range */}
                    <div className="flex-1 min-w-[150px]">
                        <YearRangePicker
                            value={{ min: initialFilters.minYear, max: initialFilters.maxYear }}
                            onChange={onFilterChange}
                        />
                    </div>

                    {/* Mileage Range */}
                    <div className="flex-1 min-w-[150px]">
                        <RangePicker
                            value={{ min: initialFilters.minMileage, max: initialFilters.maxMileage }}
                            onChange={onFilterChange}
                            title="Mileage"
                            minName="minMileage"
                            maxName="maxMileage"
                            presets={mileagePresets}
                            defaultLabel="Any Mileage"
                        />
                    </div>

                    {/* More Filters & Reset */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsMoreFiltersModalOpen(true)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-colors relative ${activeFilterCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            <SlidersHorizontal size={20} />
                            <span className="font-semibold hidden sm:inline">More</span>
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
                            )}
                        </button>
                        <button
                            onClick={onReset}
                            className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            aria-label="Reset filters"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <BrandSelectionModal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                brands={filters.makes}
                selectedBrands={initialFilters.make}
                onBrandChange={onFilterChange}
            />
            <ModelSelectionModal
                isOpen={isModelModalOpen}
                onClose={() => setIsModelModalOpen(false)}
                modelsByMake={modelsByMake}
                selectedModels={initialFilters.model}
                onModelChange={onFilterChange}
            />
            <MoreFiltersModal
                isOpen={isMoreFiltersModalOpen}
                onClose={() => setIsMoreFiltersModalOpen(false)}
                filters={filters}
                initialFilters={initialFilters}
                onFilterChange={onFilterChange}
                onReset={onReset}
            />
        </>
    );
}