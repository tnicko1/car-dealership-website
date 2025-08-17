'use client';

import { useCompare } from '@/providers/CompareProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function CompareBar() {
    const { compareList, removeFromCompare } = useCompare();

    if (compareList.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 border-t border-gray-200 dark:border-gray-700 z-50">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pr-16 sm:pr-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold whitespace-nowrap">Compare Cars ({compareList.length}/4)</h3>
                    <div className="flex gap-2">
                        {compareList.map(car => (
                            <div key={car.id} className="relative">
                                <Image
                                    src={car.images[0]?.url || 'https://placehold.co/100x75/cccccc/ffffff?text=No+Image'}
                                    alt={car.model}
                                    width={80}
                                    height={60}
                                    className="rounded"
                                />
                                <button
                                    onClick={() => removeFromCompare(car.id)}
                                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 w-5 h-5 text-xs flex items-center justify-center"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <Link href="/compare" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto">
                    Compare
                </Link>
            </div>
        </div>
    );
}
