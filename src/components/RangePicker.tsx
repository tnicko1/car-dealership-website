'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

type RangePickerProps = {
    value: { min: string, max: string };
    onChange: (value: string, name: string) => void;
    title: string;
    minName: string;
    maxName: string;
    presets: { label: string, min: string, max: string }[];
    defaultLabel: string;
};

export default function RangePicker({ value, onChange, title, minName, maxName, presets, defaultLabel }: RangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [minVal, setMinVal] = useState(value.min || '');
    const [maxVal, setMaxVal] = useState(value.max || '');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMinVal(value.min || '');
        setMaxVal(value.max || '');
    }, [value.min, value.max]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleDone = () => {
        onChange(minVal, minName);
        onChange(maxVal, maxName);
        setIsOpen(false);
    };

    const handlePreset = (min: string, max: string) => {
        setMinVal(min);
        setMaxVal(max);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, type: 'min' | 'max') => {
        let num = parseInt(e.target.value);
        if (isNaN(num)) {
            if (type === 'min') setMinVal('');
            if (type === 'max') setMaxVal('');
            return;
        }

        if (type === 'min') {
            if (maxVal && num > parseInt(maxVal)) {
                num = parseInt(maxVal);
            }
            setMinVal(num.toString());
        }

        if (type === 'max') {
            if (minVal && num < parseInt(minVal)) {
                num = parseInt(minVal);
            }
            setMaxVal(num.toString());
        }
    };

    const displayValue = minVal && maxVal ? `${minVal} - ${maxVal}` : minVal || maxVal || defaultLabel;

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <p className="text-xs text-gray-500 mb-1 ml-1">{title}</p>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex justify-between items-center"
            >
                <span className="font-semibold">{displayValue}</span>
                <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-10 p-4">
                    <div className="flex gap-4 mb-4">
                        <input
                            type="number"
                            placeholder="Min"
                            value={minVal}
                            onChange={(e) => setMinVal(e.target.value)}
                            onBlur={(e) => handleBlur(e, 'min')}
                            className="w-full p-2 border-transparent rounded-md bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition no-spinner"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxVal}
                            onChange={(e) => setMaxVal(e.target.value)}
                            onBlur={(e) => handleBlur(e, 'max')}
                            className="w-full p-2 border-transparent rounded-md bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition no-spinner"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {presets.map(p => (
                            <button key={p.label} onClick={() => handlePreset(p.min, p.max)} className="p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-primary hover:text-white transition-colors">
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleDone} className="w-full mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                        Done
                    </button>
                </div>
            )}
        </div>
    );
}
