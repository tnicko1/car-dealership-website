'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';

interface SingleModelSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    make: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export default function SingleModelSelectionModal({ isOpen, onClose, make, selectedValue, onValueChange }: SingleModelSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [models, setModels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen && make) {
            const fetchModels = async () => {
                setIsLoading(true);
                try {
                    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`);
                    const data = await response.json();
                    if (data.Results) {
                        const modelNames = data.Results.map((result: any) => result.Model_Name);
                        setModels([...new Set<string>(modelNames)].sort());
                    }
                } catch (error) {
                    console.error('Failed to fetch models:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchModels();
        }
    }, [isOpen, make]);

    const filteredModels = useMemo(() => {
        return models.filter((model: string) => model.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [models, searchTerm]);

    const handleSelect = (model: string) => {
        onValueChange(model);
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Select Model for {make}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 border-b">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a model..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 border-transparent rounded-lg py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <p>Loading models...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {filteredModels.map((model: string) => (
                                <div
                                    key={model}
                                    onClick={() => handleSelect(model)}
                                    className={`p-4 border rounded-lg flex items-center justify-center text-center cursor-pointer transition-all duration-200
                                        ${selectedValue === model ? 'bg-red-100 border-red-500 ring-2 ring-red-500' : 'hover:bg-gray-50 hover:shadow-md'}`}
                                >
                                    <span className="text-sm font-medium">{model}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (!isOpen || !isMounted) return null;

    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? createPortal(modalContent, modalRoot) : null;
}
