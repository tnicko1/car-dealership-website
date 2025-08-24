'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { CarWithImages } from '@/types/car';

type ModalType = 'inquiry' | 'testDrive' | 'tradeIn' | 'brandSelection' | null;

type ModalContextType = {
    modalType: ModalType;
    openModal: (type: ModalType, car?: CarWithImages) => void;
    closeModal: () => void;
    selectedCar: CarWithImages | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedCar, setSelectedCar] = useState<CarWithImages | null>(null);

    const openModal = (type: ModalType, car: CarWithImages | null = null) => {
        setModalType(type);
        if (car) {
            setSelectedCar(car);
        }
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedCar(null);
    };

    return (
        <ModalContext.Provider value={{ modalType, openModal, closeModal, selectedCar }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
