'use client';

const FilterSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="py-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">{title}</h3>
        {children}
    </div>
);

export default FilterSection;
