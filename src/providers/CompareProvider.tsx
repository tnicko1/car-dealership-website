'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { CarWithImages } from '@/types/car';

interface CompareContextType {
    compareList: CarWithImages[];
    addToCompare: (car: CarWithImages) => void;
    removeFromCompare: (carId: string) => void;
    clearCompare: () => void;
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

    useEffect(() => {
        const storedList = localStorage.getItem('compareList');
        if (storedList) {
            setCompareList(JSON.parse(storedList));
        }
    }, []);

    const updateAndStoreList = (list: CarWithImages[]) => {
        setCompareList(list);
        localStorage.setItem('compareList', JSON.stringify(list));
    };

    const addToCompare = (car: CarWithImages) => {
        if (compareList.length < 4 && !compareList.some(c => c.id === car.id)) {
            updateAndStoreList([...compareList, car]);
        }
    };

    const removeFromCompare = (carId: string) => {
        updateAndStoreList(compareList.filter(c => c.id !== carId));
    };

    const clearCompare = () => {
        updateAndStoreList([]);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};
