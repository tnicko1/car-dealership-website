'use client';

import { createContext, useContext, useState } from 'react';
import type { CarWithImages } from '@/types/car';

interface CompareContextType {
    compareList: CarWithImages[];
    addToCompare: (car: CarWithImages) => void;
    removeFromCompare: (carId: string) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
    const [compareList, setCompareList] = useState<CarWithImages[]>([]);

    const addToCompare = (car: CarWithImages) => {
        if (compareList.length < 4 && !compareList.some(c => c.id === car.id)) {
            setCompareList([...compareList, car]);
        }
    };

    const removeFromCompare = (carId: string) => {
        setCompareList(compareList.filter(c => c.id !== carId));
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare }}>
            {children}
        </CompareContext.Provider>
    );
};
