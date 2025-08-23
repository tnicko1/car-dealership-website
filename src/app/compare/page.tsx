'use client';

import { useCompare } from '@/providers/CompareProvider';
import { CarWithImages } from '@/types/car';
import Image from 'next/image';
import Link from 'next/link';

const SpecRow = ({ label, cars }: { label: string, cars: CarWithImages[] }) => {
    const getSpecValue = (car: CarWithImages, spec: string) => {
        switch(spec) {
            case 'Price': return `$${car.price.toLocaleString()}`;
            case 'Year': return car.year;
            case 'Mileage': return `${car.mileage.toLocaleString()} mi`;
            case 'Horsepower': return `${car.horsepower} hp`;
            case 'Fuel Type': return car.fuelType;
            case 'Transmission': return car.transmission;
            case 'Body Style': return car.bodyStyle;
            case 'Engine Volume': return car.engineVolume ? `${car.engineVolume}L` : 'N/A';
            default: return 'N/A';
        }
    };

    return (
        <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="py-4 px-2 font-semibold text-gray-600 dark:text-gray-300">{label}</td>
            {cars.map(car => (
                <td key={car.id} className="py-4 px-2 text-center">{getSpecValue(car, label)}</td>
            ))}
        </tr>
    );
};

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-3xl font-bold mb-4">Compare Cars</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">You haven't added any cars to compare yet.</p>
                <Link href="/cars" className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-500 transition-colors">
                    Explore Vehicles
                </Link>
            </div>
        );
    }

    const specs = ['Price', 'Year', 'Mileage', 'Horsepower', 'Fuel Type', 'Transmission', 'Body Style', 'Engine Volume'];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Compare Cars ({compareList.length}/4)</h1>
                <button onClick={clearCompare} className="text-gray-500 hover:text-red-600 transition-colors font-semibold">
                    Clear All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                            <th className="py-4 px-2"></th>
                            {compareList.map(car => (
                                <th key={car.id} className="py-4 px-2 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Image src={car.images[0]?.url || ''} alt={car.model} width={150} height={100} className="rounded-lg" />
                                        <h2 className="font-bold text-lg">{car.year} {car.make} {car.model}</h2>
                                        <button onClick={() => removeFromCompare(car.id)} className="text-xs text-red-500 hover:underline">
                                            Remove
                                        </button>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {specs.map(spec => (
                            <SpecRow key={spec} label={spec} cars={compareList} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}