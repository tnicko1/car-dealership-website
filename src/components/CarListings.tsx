'use client';

import { useState, useEffect, Fragment } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CarWithImages } from '@/types/car';
import CarCard from './CarCard';
import FilterSidebar from './FilterSidebar';
import { List, Grid, Filter, X, ArrowUpDown } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';

type FilterProps = {
    makes: string[];
    bodyStyles: string[];
    fuelTypes: string[];
    transmissions: string[];
};

export default function CarListings({ initialCars, filters, wishlistedCarIds }: { initialCars: CarWithImages[], filters: FilterProps, wishlistedCarIds: string[] }) {
    const [cars, setCars] = useState(initialCars);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filtersState, setFiltersState] = useState(() => {
        const params = new URLSearchParams(searchParams.toString());
        return {
            make: params.getAll('make') || [],
            model: params.get('model') || '',
            minPrice: params.get('minPrice') || '',
            maxPrice: params.get('maxPrice') || '',
            minYear: params.get('minYear') || '',
            maxYear: params.get('maxYear') || '',
            minMileage: params.get('minMileage') || '',
            maxMileage: params.get('maxMileage') || '',
            bodyStyle: params.getAll('bodyStyle') || [],
            fuelType: params.getAll('fuelType') || [],
            transmission: params.getAll('transmission') || [],
        };
    });

    const [view, setView] = useState('grid');
    const [sortOrder, setSortOrder] = useState('createdAt-desc');
    const [visibleCount, setVisibleCount] = useState(9);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isSortActive = sortOrder !== 'createdAt-desc';

    useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true);
            const params = new URLSearchParams();
            Object.entries(filtersState).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v));
                } else if (value) {
                    params.append(key, value);
                }
            });
            params.append('sort', sortOrder);

            router.push(`${pathname}?${params.toString()}`, { scroll: false });

            const res = await fetch(`/api/cars?${params.toString()}`);
            const data = await res.json();
            setCars(data);
            setIsLoading(false);
        };

        fetchCars();
    }, [filtersState, sortOrder, pathname, router]);

    const handleFilterChange = (value: string, name: string, checked?: boolean) => {
        setFiltersState(prev => {
            const newState = { ...prev };
            const key = name as keyof typeof newState;

            if (Array.isArray(newState[key])) {
                const list = newState[key] as string[];
                if (checked) {
                    // @ts-ignore
                    newState[key] = [...list, value];
                } else {
                    // @ts-ignore
                    newState[key] = list.filter(item => item !== value);
                }
            } else {
                // @ts-ignore
                newState[key] = value;
            }
            return newState;
        });
        setVisibleCount(9);
    };

    const handleReset = () => {
        setFiltersState({
            make: [], model: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '',
            minMileage: '', maxMileage: '', bodyStyle: [], fuelType: [], transmission: [],
        });
        setSortOrder('createdAt-desc');
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    const CarListItem = ({ car }: { car: CarWithImages }) => (
        <Link href={`/cars/${car.id}`} className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 gap-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
            <div className="w-1/3 h-32 relative flex-shrink-0">
                <Image src={car.images[0]?.url || 'https://placehold.co/600x400'} alt={`${car.make} ${car.model}`} fill style={{ objectFit: 'cover' }} className="rounded-md" />
            </div>
            <div className="w-2/3">
                <h3 className="text-lg font-bold">{car.make} {car.model}</h3>
                <p className="text-xl font-semibold text-primary dark:text-primary-400">${car.price.toLocaleString()}</p>
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
        <>
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div className="hidden lg:block lg:col-span-1 lg:sticky top-24">
                    <FilterSidebar {...filters} onFilterChange={handleFilterChange} initialFilters={filtersState} onReset={handleReset} />
                </div>

                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-gray-600 dark:text-gray-400">Showing {Math.min(visibleCount, cars.length)} of {cars.length} results</p>
                        <div className="flex gap-2 items-center">
                            <div className={`relative rounded-md transition-all duration-300 ${isSortActive ? 'static-glow' : ''}`}>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none bg-gray-200 dark:bg-gray-700 border-none rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="createdAt-desc">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="mileage-asc">Mileage: Low to High</option>
                                    <option value="year-desc">Year: Newest First</option>
                                </select>
                                <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
                            </div>
                            {isSortActive && (
                                <button onClick={() => setSortOrder('createdAt-desc')} className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" aria-label="Remove sort">
                                    <X size={20} />
                                </button>
                            )}
                            <button onClick={() => setIsFilterOpen(true)} className="lg:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-700">
                                <Filter />
                            </button>
                            <button onClick={() => setView('grid')} className={`p-2 rounded-md ${view === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <Grid />
                            </button>
                            <button onClick={() => setView('list')} className={`p-2 rounded-md ${view === 'list' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <List />
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-16">
                            <p>Loading...</p>
                        </div>
                    ) : cars.length > 0 ? (
                        <>
                            {view === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                                    {cars.slice(0, visibleCount).map((car) => (
                                        <CarCard key={car.id} car={car} isWishlisted={wishlistedCarIds.includes(car.id)} showMileage={sortOrder.startsWith('mileage')} />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cars.slice(0, visibleCount).map((car) => (
                                        <CarListItem key={car.id} car={car} />
                                    ))}
                                </div>
                            )}

                            {visibleCount < cars.length && (
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
                            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            <Transition appear show={isFilterOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => setIsFilterOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Filters</Dialog.Title>
                                        <button onClick={() => setIsFilterOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X /></button>
                                    </div>
                                    <FilterSidebar {...filters} onFilterChange={handleFilterChange} initialFilters={filtersState} onReset={handleReset} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
