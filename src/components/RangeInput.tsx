'use client';

import { useDebouncedCallback } from 'use-debounce';

const RangeInput = ({ name, title, value, onValueChange, type = 'number', step = 'any' }: any) => {
    const debouncedOnChange = useDebouncedCallback(onValueChange, 400);
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{title}</label>
            <div className="flex gap-2 mt-1">
                <input
                    type={type}
                    name={`min${name}`}
                    placeholder="Min"
                    defaultValue={value.min}
                    onChange={(e) => debouncedOnChange(e.target.value, `min${name}`)}
                    step={step}
                    className="w-full p-2 border-transparent rounded-md bg-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition no-spinner"
                />
                <input
                    type={type}
                    name={`max${name}`}
                    placeholder="Max"
                    defaultValue={value.max}
                    onChange={(e) => debouncedOnChange(e.target.value, `max${name}`)}
                    step={step}
                    className="w-full p-2 border-transparent rounded-md bg-gray-100 focus:ring-2 focus:ring-primary focus:border-transparent transition no-spinner"
                />
            </div>
        </div>
    );
};

export default RangeInput;
