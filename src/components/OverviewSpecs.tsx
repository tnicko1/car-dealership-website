import type { Car } from '@prisma/client';
import { motion } from 'framer-motion';

const SpecItem = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-medium text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-semibold text-gray-900 dark:text-white text-right">{value}</span>
        </div>
    );
};

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
            },
        },
    };

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4">Overview</h3>
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 flex-grow"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {overviewSpecs.map(spec => (
                    <motion.div key={spec.label} variants={itemVariants}>
                        <SpecItem label={spec.label} value={spec.value} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
