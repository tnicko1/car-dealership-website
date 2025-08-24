import type { Car } from '@prisma/client';

const SpecItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-gray-900 dark:text-white">{value || 'N/A'}</span>
    </div>
);

export default function OverviewSpecs({ car }: { car: Car }) {
    const overviewSpecs = [
        { label: 'Make', value: car.make },
        { label: 'Model', value: car.model },
        { label: 'Year', value: car.year },
        { label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
        { label: 'Body Style', value: car.bodyStyle },
        { label: 'Color', value: car.color },
        { label: 'Interior Color', value: car.interiorColor },
        { label: 'Interior Material', value: car.interiorMaterial },
        { label: 'Doors', value: car.doors },
        { label: 'Wheel', value: car.wheel },
        { label: 'VIN', value: car.vin },
        { label: 'Paint Code', value: car.paintCode },
    ];

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Overview</h3>
            <div className="space-y-2">
                {overviewSpecs.map(spec => (
                    <SpecItem key={spec.label} label={spec.label} value={spec.value} />
                ))}
            </div>
        </div>
    );
}
