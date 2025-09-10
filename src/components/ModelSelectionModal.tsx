'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search } from 'lucide-react';

interface ModelSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    modelsByMake: { [make: string]: string[] };
    selectedModels: string[];
    onModelChange: (value: string, name: string, isChecked: boolean) => void;
}

export default function ModelSelectionModal({ isOpen, onClose, modelsByMake, selectedModels, onModelChange }: ModelSelectionModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const filteredModelsByMake = useMemo(() => {
        if (!searchTerm) {
            return modelsByMake;
        }
        const filtered: { [make: string]: string[] } = {};
        for (const make in modelsByMake) {
            const models = modelsByMake[make].filter(model =>
                model.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (models.length > 0) {
                filtered[make] = models;
            }
        }
        return filtered;
    }, [modelsByMake, searchTerm]);

    const modalContent = (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Select Models</h2>
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
                    {Object.keys(filteredModelsByMake).length === 0 ? (
                        <div className="text-center text-gray-500">No models found.</div>
                    ) : (
                        Object.entries(filteredModelsByMake).map(([make, models]) => (
                            <div key={make} className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">{make}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {models.map((model: string) => (
                                        <div
                                            key={model}
                                            onClick={() => onModelChange(model, 'model', !selectedModels.includes(model))}
                                            className={`p-4 border rounded-lg flex items-center justify-center text-center cursor-pointer transition-all duration-200
                                                ${selectedModels.includes(model) ? 'bg-red-100 border-red-500 ring-2 ring-red-500' : 'hover:bg-gray-50 hover:shadow-md'}`}
                                        >
                                            <span className="text-sm font-medium">{model}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 border-t mt-auto">
                    <button onClick={onClose} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isOpen || !isMounted) return null;

    const modalRoot = document.getElementById('modal-root');
    return modalRoot ? createPortal(modalContent, modalRoot) : null;
}
