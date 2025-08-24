'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ModalContextType = {
    isBrandModalOpen: boolean;
    setIsBrandModalOpen: (isOpen: boolean) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ isBrandModalOpen, setIsBrandModalOpen }}>
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
