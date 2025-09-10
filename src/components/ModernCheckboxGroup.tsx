'use client';

export default function ModernCheckboxGroup({ name, title, options, value, onValueChange }: any) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
            <div className="flex flex-wrap gap-2">
                {options.map((option: string) => (
                    <button
                        key={option}
                        onClick={() => onValueChange(option, name, !value.includes(option))}
                        className={`px-4 py-2 border rounded-full text-sm font-semibold transition-all duration-200
                            ${value.includes(option)
                                ? 'bg-primary text-white border-primary'
                                : 'bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
