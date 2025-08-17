'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CarWithImages } from '@/types/car';
import CarCard from './CarCard';
import FilterSidebar from './FilterSidebar';
import { List, Grid } from 'lucide-react';

type FilterProps = {
    makes: string[];
    bodyStyles: string[];
    fuelTypes: string[];
    transmissions: string[];
};

export default function CarListings({ cars, filters, wishlistedCarIds }: { cars: CarWithImages[], filters: FilterProps, wishlistedCarIds: string[] }) {
    const [filtersState, setFiltersState] = useState({
        make: '',
        model: '',
        maxPrice: 200000,
        minYear: 1990,
        maxYear: new Date().getFullYear(),
        maxMileage: 300000,
        bodyStyle: '',
        fuelType: '',
        transmission: '',
    });
    const [view, setView] = useState('grid');
    const [visibleCount, setVisibleCount] = useState(9);

    const filteredCars = useMemo(() => {
        return cars.filter(car => {
            return (
                (filtersState.make ? car.make === filtersState.make : true) &&
                (filtersState.model ? car.model.toLowerCase().includes(filtersState.model.toLowerCase()) : true) &&
                (car.price <= filtersState.maxPrice) &&
                (car.year >= filtersState.minYear) &&
                (car.year <= filtersState.maxYear) &&
                (car.mileage <= filtersState.maxMileage) &&
                (filtersState.bodyStyle ? car.bodyStyle === filtersState.bodyStyle : true) &&
                (filtersState.fuelType ? car.fuelType === filtersState.fuelType : true) &&
                (filtersState.transmission ? car.transmission === filtersState.transmission : true)
            );
        });
    }, [cars, filtersState]);

    const handleFilterChange = (value: string | number, name: string) => {
        setFiltersState(prev => ({ ...prev, [name]: value }));
        setVisibleCount(9); // Reset pagination on filter change
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    const CarListItem = ({ car }: { car: CarWithImages }) => (
        <Link href={`/cars/${car.id}`} className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 gap-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
            <div className="w-1/3 h-32 relative">
                <Image src={car.images[0]?.url || ''} alt={`${car.make} ${car.model}`} fill style={{ objectFit: 'cover' }} className="rounded-md" />
            </div>
            <div className="w-2/3">
                <h3 className="text-lg font-bold">{car.make} {car.model}</h3>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">${car.price.toLocaleString()}</p>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 grid grid-cols-2 gap-2">
                    <p><strong>Year:</strong> {car.year}</p>
                    <p><strong>Mileage:</strong> {car.mileage.toLocaleString()} mi</p>
                    <p><strong>Fuel:</strong> {car.fuelType}</p>
                    <p><strong>Transmission:</strong> {car.transmission}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky top-24">
                <FilterSidebar {...filters} onFilterChange={handleFilterChange} initialFilters={filtersState} />
            </div>

            <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600 dark:text-gray-400">Showing {Math.min(visibleCount, filteredCars.length)} of {filteredCars.length} results</p>
                    <div className="flex gap-2">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            <Grid />
                        </button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            <List />
                        </button>
                    </div>
                </div>

                {filteredCars.length > 0 ? (
                    <>
                        {view === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {filteredCars.slice(0, visibleCount).map((car) => (
                                    <CarCard key={car.id} car={car} isWishlisted={wishlistedCarIds.includes(car.id)} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCars.slice(0, visibleCount).map((car) => (
                                    <CarListItem key={car.id} car={car} />
                                ))}
                            </div>
                        )}

                        {visibleCount < filteredCars.length && (
                            <div className="text-center mt-12">
                                <button onClick={loadMore} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-500 transition-colors">
                                    Load More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">No Cars Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}