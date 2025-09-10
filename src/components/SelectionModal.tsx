'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { colorHexMap } from '@/lib/colorMapping';

interface SelectionModalProps {
    fieldName: string;
    options: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
}

export default function SelectionModal({ fieldName, options, selectedValue, onValueChange }: SelectionModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (value: string) => {
        onValueChange(value);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {selectedValue || `Select ${fieldName}`}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select {fieldName}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {options.map(option => (
                        <Button
                            key={option}
                            variant={selectedValue === option ? 'default' : 'outline'}
                            onClick={() => handleSelect(option)}
                            className="flex items-center justify-center gap-2"
                        >
                            {(fieldName === 'Color' || fieldName === 'Interior Color') && colorHexMap[option] && (
                                <span
                                    className={`h-4 w-4 rounded-full ${option === 'White' ? 'border border-gray-400' : ''}`}
                                    style={{ backgroundColor: colorHexMap[option] }}
                                />
                            )}
                            {option}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
