'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CarWithImages } from '@/types/car';
import CarCard from './CarCard';
import FilterBar from './FilterBar';
import { List, Grid, ArrowUpDown, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/providers/ModalProvider';
import { getGeneralColor } from '@/lib/colorUtils';
import { getGeneralMaterial } from '@/lib/materialUtils';
import { matchesFilter } from '@/lib/filterNormalization';

type FilterProps = {
    makes: string[];
    bodyStyles: string[];
    fuelTypes: string[];
    transmissions: string[];
    driveWheels: string[];
    colors: string[];
    interiorColors: string[];
    interiorMaterials: string[];
    cylinders: string[];
    doors: string[];
    wheelTypes: string[];
    features: string[];
    minMaxValues: any;
};

const initialFilterState = {
    make: [], model: [], minPrice: '', maxPrice: '', minYear: '', maxYear: '',
    minMileage: '', maxMileage: '', minHorsepower: '', maxHorsepower: '',
    minEngineVolume: '', maxEngineVolume: '', minTopSpeed: '', maxTopSpeed: '',
    minZeroToSixty: '', maxZeroToSixty: '', minWeight: '', maxWeight: '',
    bodyStyle: [], fuelType: [], transmission: [], driveWheels: [], wheel: [],
    color: [], interiorColor: [], interiorMaterial: [], cylinders: [], doors: [],
    features: [], hasVin: false, exchange: false, technicalInspection: false,
};

export default function CarListings({ initialCars, filters, wishlistedCarIds }: { initialCars: CarWithImages[], filters: FilterProps, wishlistedCarIds: string[] }) {
    const searchParams = useSearchParams();
    const { modalType } = useModal();
    const isModalOpen = modalType !== null;

    const [filtersState, setFiltersState] = useState(() => {
        const params = new URLSearchParams(searchParams.toString());
        const getAll = (key: string) => params.getAll(key) || [];
        return {
            ...initialFilterState,
            make: getAll('make'),
            model: getAll('model'),
            minPrice: params.get('minPrice') || '',
            maxPrice: params.get('maxPrice') || '',
            minYear: params.get('minYear') || '',
            maxYear: params.get('maxYear') || '',
            bodyStyle: getAll('bodyStyle'),
            fuelType: getAll('fuelType'),
            transmission: getAll('transmission'),
            driveWheels: getAll('driveWheels'),
            wheel: getAll('wheel'),
            features: getAll('features'),
            hasVin: params.get('hasVin') === 'true',
        };
    });

    const [modelsByMake, setModelsByMake] = useState<{ [make: string]: string[] }>({});
    const [view, setView] = useState('grid');
    const [sortOrder, setSortOrder] = useState('createdAt-desc');
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const fetchModels = async () => {
            if (filtersState.make.length > 0) {
                const newModelsByMake: { [make: string]: string[] } = {};
                const promises = filtersState.make.map(async make => {
                    const response = await fetch(`/api/cars/models?make=${make}`);
                    const data = await response.json();
                    if (data.Results) {
                        const modelNames = data.Results.map((r: any) => r.Model_Name);
                        newModelsByMake[make] = [...new Set<string>(modelNames)].sort();
                    }
                });
                await Promise.all(promises);
                setModelsByMake(newModelsByMake);
            } else {
                setModelsByMake({});
            }
        };
        fetchModels();
    }, [filtersState.make]);

    const isSortActive = sortOrder !== 'createdAt-desc';

    const displayedCars = useMemo(() => {
        return initialCars.filter(car => {
            const { make, model, minPrice, maxPrice, minYear, maxYear, minMileage, maxMileage, minHorsepower, maxHorsepower, bodyStyle, fuelType, transmission, driveWheels, wheel, color, interiorColor, interiorMaterial, cylinders, doors, features, hasVin, exchange, technicalInspection, minEngineVolume, maxEngineVolume, minTopSpeed, maxTopSpeed, minZeroToSixty, maxZeroToSixty, minWeight, maxWeight } = filtersState;
            
            const inRange = (value: number | null | undefined, min: string, max: string) => {
                if (value === null || value === undefined) return true;
                const minVal = parseFloat(min);
                const maxVal = parseFloat(max);
                if (min && value < minVal) return false;
                return !(max && value > maxVal);

            };

            const inArray = (value: string | null | undefined, arr: string[]) => {
                return arr.length === 0 || (value ? arr.includes(value) : false);
            };
            
            const inArrayOfNumbers = (value: number | null | undefined, arr: string[]) => {
                return arr.length === 0 || (value ? arr.includes(value.toString()) : false);
            }

            const inColorGroup = (specificColor: string | null | undefined, selectedGroups: string[]) => {
                if (selectedGroups.length === 0) return true;
                if (!specificColor) return false;
                return selectedGroups.includes(getGeneralColor(specificColor));
            };

            const inMaterialGroup = (specificMaterial: string | null | undefined, selectedGroups: string[]) => {
                if (selectedGroups.length === 0) return true;
                if (!specificMaterial) return false;
                return selectedGroups.includes(getGeneralMaterial(specificMaterial));
            };

            if (!inArray(car.make, make)) return false;
            if (!inArray(car.model, model)) return false;
            if (!inRange(car.price, minPrice, maxPrice)) return false;
            if (!inRange(car.year, minYear, maxYear)) return false;
            if (!inRange(car.mileage, minMileage, maxMileage)) return false;
            if (!inRange(car.horsepower, minHorsepower, maxHorsepower)) return false;
            if (!inRange(car.engineVolume, minEngineVolume, maxEngineVolume)) return false;
            if (!inRange(car.topSpeed, minTopSpeed, maxTopSpeed)) return false;
            if (!inRange(car.zeroToSixty, minZeroToSixty, maxZeroToSixty)) return false;
            if (!inRange(car.weight, minWeight, maxWeight)) return false;
            if (!matchesFilter(car.bodyStyle, bodyStyle, 'bodyStyle')) return false;
            if (!matchesFilter(car.driveWheels, driveWheels, 'driveWheels')) return false;
            if (!inArray(car.fuelType, fuelType)) return false;
            if (!inArray(car.transmission, transmission)) return false;
            if (!inArray(car.wheel, wheel)) return false;
            if (!inColorGroup(car.color, color)) return false;
            if (!inColorGroup(car.interiorColor, interiorColor)) return false;
            if (!inMaterialGroup(car.interiorMaterial, interiorMaterial)) return false;
            if (!inArrayOfNumbers(car.cylinders, cylinders)) return false;
            if (!inArrayOfNumbers(car.doors, doors)) return false;
            if (features.length > 0 && !features.every(feat => car.features.includes(feat))) return false;
            if (hasVin && !car.vin) return false;
            if (exchange && car.exchange !== exchange) return false;
            return !(technicalInspection && car.technicalInspection !== technicalInspection);
        }).sort((a, b) => {
            const [sortBy, sortDirection] = sortOrder.split('-');
            let valA: any, valB: any;
            switch (sortBy) {
                case 'price': valA = a.price; valB = b.price; break;
                case 'mileage': valA = a.mileage; valB = b.mileage; break;
                case 'year': valA = a.year; valB = b.year; break;
                default: valA = new Date(a.createdAt).getTime(); valB = new Date(b.createdAt).getTime(); break;
            }
            return sortDirection === 'asc' ? valA - valB : valB - valA;
        });
    }, [initialCars, filtersState, sortOrder]);

    const handleFilterChange = (value: string | boolean, name: string, isChecked?: boolean) => {
        setFiltersState(prev => {
            const newState = { ...prev };
            const key = name as keyof typeof newState;
    
            if (Array.isArray(newState[key])) {
                const list = newState[key] as string[];
                const itemValue = value as string;
                
                if (isChecked === true) {
                    if (!list.includes(itemValue)) newState[key] = [...list, itemValue] as never;
                } else if (isChecked === false) {
                    newState[key] = list.filter(item => item !== itemValue) as never;
                }
            } 
            else if (typeof newState[key] === 'boolean') {
                newState[key] = value as never;
            } 
            else {
                newState[key] = value as never;
            }
            
            return newState;
        });
        setVisibleCount(12);
    };
    
    const handleReset = () => setFiltersState(initialFilterState);

    const loadMore = () => setVisibleCount(prev => prev + 12);

    const CarListItem = ({ car }: { car: CarWithImages }) => (
        <Link href={`/cars/${car.id}`} className="flex bg-white rounded-lg shadow-md p-4 gap-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
            <div className="w-1/3 h-32 relative flex-shrink-0">
                <Image src={car.images[0]?.url || 'https://dummyimage.com/600x400'} alt={`${car.make} ${car.model}`} fill sizes="100vw" style={{ objectFit: 'cover' }} className="rounded-md" />
            </div>
            <div className="w-2/3">
                <h3 className="text-lg font-bold">{car.make} {car.model}</h3>
                <p className="text-xl font-semibold text-primary">${car.price.toLocaleString()}</p>
                <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
                    <p><strong>Year:</strong> {car.year}</p>
                    <p><strong>Mileage:</strong> {car.mileage.toLocaleString()} mi</p>
                    <p><strong>Fuel:</strong> {car.fuelType}</p>
                    <p><strong>Transmission:</strong> {car.transmission}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <div className={`container mx-auto px-4 py-12 ${isModalOpen ? 'pointer-events-none blur-sm' : ''}`}>
            <FilterBar filters={filters} modelsByMake={modelsByMake} onFilterChange={handleFilterChange} initialFilters={filtersState} onReset={handleReset} />

            <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Showing {Math.min(visibleCount, displayedCars.length)} of {displayedCars.length} results</p>
                <div className="flex gap-2 items-center">
                    <div className={`relative rounded-md transition-all duration-300 ${isSortActive ? 'static-glow' : ''}`}>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="appearance-none bg-gray-200 border-none rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="createdAt-desc">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="mileage-asc">Mileage: Low to High</option>
                            <option value="year-desc">Year: Newest First</option>
                        </select>
                        <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    {isSortActive && (
                        <button onClick={() => setSortOrder('createdAt-desc')} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Remove sort">
                            <X size={20} />
                        </button>
                    )}
                    <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                        <Grid />
                    </button>
                    <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                        <List />
                    </button>
                </div>
            </div>

            {displayedCars.length > 0 ? (
                <>
                    {view === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                            {displayedCars.slice(0, visibleCount).map((car) => (
                                <CarCard key={car.id} car={car} isWishlisted={wishlistedCarIds.includes(car.id)} showMileage={sortOrder.startsWith('mileage')} allowMobileSwipe={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayedCars.slice(0, visibleCount).map((car) => (
                                <CarListItem key={car.id} car={car} />
                            ))}
                        </div>
                    )}

                    {visibleCount < displayedCars.length && (
                        <div className="text-center mt-12">
                            <button onClick={loadMore} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-500 transition-colors">
                                Load More
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold">No Cars Found</h2>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or clearing your search.</p>
                </div>
            )}
        </div>
    );
}
