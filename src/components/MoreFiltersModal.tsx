'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, SlidersHorizontal } from 'lucide-react';
import { featureCategories } from '@/lib/carFeatures';
import ModernCheckboxGroup from './ModernCheckboxGroup';
import FilterSection from './FilterSection';
import RangeInput from './RangeInput';

export default function MoreFiltersModal({ isOpen, onClose, filters, onFilterChange, initialFilters, onReset }: any) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center">
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white flex items-center gap-2">
                                        <SlidersHorizontal size={22} />
                                        More Filters
                                    </Dialog.Title>
                                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                                
                                <div className="space-y-2 mt-4 max-h-[60vh] overflow-y-auto pr-4">
                                    <FilterSection title="Drivetrain & Engine">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <ModernCheckboxGroup name="transmission" title="Transmission" options={filters.transmissions} value={initialFilters.transmission} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="driveWheels" title="Drive Wheels" options={filters.driveWheels} value={initialFilters.driveWheels} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="fuelType" title="Fuel Type" options={filters.fuelTypes} value={initialFilters.fuelType} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="cylinders" title="Cylinders" options={filters.cylinders} value={initialFilters.cylinders} onValueChange={onFilterChange} />
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Performance & Dimensions">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <RangeInput name="Horsepower" title="Horsepower" value={{ min: initialFilters.minHorsepower, max: initialFilters.maxHorsepower }} onValueChange={onFilterChange} />
                                            <RangeInput name="EngineVolume" title="Engine Volume (L)" value={{ min: initialFilters.minEngineVolume, max: initialFilters.maxEngineVolume }} onValueChange={onFilterChange} step="0.1" />
                                            <RangeInput name="TopSpeed" title="Top Speed (mph)" value={{ min: initialFilters.minTopSpeed, max: initialFilters.maxTopSpeed }} onValueChange={onFilterChange} />
                                            <RangeInput name="ZeroToSixty" title="0-60 mph (sec)" value={{ min: initialFilters.minZeroToSixty, max: initialFilters.maxZeroToSixty }} onValueChange={onFilterChange} step="0.1" />
                                            <RangeInput name="Weight" title="Weight (lbs)" value={{ min: initialFilters.minWeight, max: initialFilters.maxWeight }} onValueChange={onFilterChange} />
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Exterior & Interior">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <ModernCheckboxGroup name="bodyStyle" title="Body Style" options={filters.bodyStyles} value={initialFilters.bodyStyle} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="color" title="Exterior Color" options={filters.colors} value={initialFilters.color} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="interiorColor" title="Interior Color" options={filters.interiorColors} value={initialFilters.interiorColor} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="interiorMaterial" title="Interior Material" options={filters.interiorMaterials} value={initialFilters.interiorMaterial} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="doors" title="Doors" options={filters.doors} value={initialFilters.doors} onValueChange={onFilterChange} />
                                            <ModernCheckboxGroup name="wheel" title="Steering Wheel Side" options={filters.wheelTypes} value={initialFilters.wheel} onValueChange={onFilterChange} />
                                        </div>
                                    </FilterSection>
                                    
                                    <FilterSection title="Options">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <label className="flex items-center gap-2"><input type="checkbox" name="exchange" checked={initialFilters.exchange} onChange={(e) => onFilterChange(e.target.checked, 'exchange')} className="h-4 w-4 rounded text-primary focus:ring-primary" /> Exchange Possible</label>
                                            <label className="flex items-center gap-2"><input type="checkbox" name="technicalInspection" checked={initialFilters.technicalInspection} onChange={(e) => onFilterChange(e.target.checked, 'technicalInspection')} className="h-4 w-4 rounded text-primary focus:ring-primary" /> Has Technical Inspection</label>
                                        </div>
                                    </FilterSection>

                                    {Object.entries(featureCategories).map(([category, features]) => (
                                        <FilterSection key={category} title={category}>
                                            <ModernCheckboxGroup name="features" options={features} value={initialFilters.features} onValueChange={onFilterChange} />
                                        </FilterSection>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-between items-center border-t pt-5 dark:border-gray-700">
                                    <button onClick={onReset} className="text-sm font-semibold text-primary hover:underline">
                                        Reset All Filters
                                    </button>
                                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-700 transition-colors">
                                        Show Results
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}