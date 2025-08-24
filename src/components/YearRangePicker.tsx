'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function YearRangePicker({ value, onChange }: { value: { min: string, max: string }, onChange: (value: string, name: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [fromYear, setFromYear] = useState(value.min || '');
    const [toYear, setToYear] = useState(value.max || '');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    const fromYears = toYear ? years.filter(y => y <= parseInt(toYear)) : years;
    const toYears = fromYear ? years.filter(y => y >= parseInt(fromYear)) : years;

    useEffect(() => {
        setFromYear(value.min || '');
        setToYear(value.max || '');
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
        onChange(fromYear, 'minYear');
        onChange(toYear, 'maxYear');
        setIsOpen(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, type: 'from' | 'to') => {
        let year = parseInt(e.target.value);
        const minAllowed = 1900;
        const maxAllowed = new Date().getFullYear();

        if (isNaN(year)) {
            if (type === 'from') setFromYear('');
            if (type === 'to') setToYear('');
            return;
        }

        year = Math.max(minAllowed, Math.min(maxAllowed, year));

        if (type === 'from') {
            if (toYear && year > parseInt(toYear)) {
                year = parseInt(toYear);
            }
            setFromYear(year.toString());
        }

        if (type === 'to') {
            if (fromYear && year < parseInt(fromYear)) {
                year = parseInt(fromYear);
            }
            setToYear(year.toString());
        }
    };

    const displayValue = fromYear && toYear ? `${fromYear} - ${toYear}` : fromYear || toYear || 'All Years';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <p className="text-xs text-gray-500 mb-1 ml-1">Year Range</p>
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
                            placeholder="From"
                            value={fromYear}
                            onChange={(e) => setFromYear(e.target.value)}
                            onBlur={(e) => handleBlur(e, 'from')}
                            className="w-full p-2 border-transparent rounded-md bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition no-spinner"
                        />
                        <input
                            type="number"
                            placeholder="To"
                            value={toYear}
                            onChange={(e) => setToYear(e.target.value)}
                            onBlur={(e) => handleBlur(e, 'to')}
                            className="w-full p-2 border-transparent rounded-md bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition no-spinner"
                        />
                    </div>
                    <div className="flex gap-4 h-48">
                        <div className="w-1/2 overflow-y-auto">
                            {fromYears.map(year => (
                                <div key={`from-${year}`} onClick={() => setFromYear(prev => prev === year.toString() ? '' : year.toString())} className={`p-2 cursor-pointer rounded-md ${fromYear === year.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    {year}
                                </div>
                            ))}
                        </div>
                        <div className="w-1/2 overflow-y-auto">
                            {toYears.map(year => (
                                <div key={`to-${year}`} onClick={() => setToYear(prev => prev === year.toString() ? '' : year.toString())} className={`p-2 cursor-pointer rounded-md ${toYear === year.toString() ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    {year}
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleDone} className="w-full mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                        Done
                    </button>
                </div>
            )}
        </div>
    );
}
