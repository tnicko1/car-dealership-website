'use client';

import { useState } from 'react';
import { Car } from '@prisma/client';
import { useSwipeable } from 'react-swipeable';
import { 
    CheckCircle, Gauge, Fuel, SlidersHorizontal, Zap, Car as CarIcon, Hash, Palette, 
    ChevronsRightLeft, Calendar, Paintbrush, DoorOpen,
    Box, ArrowUp, Maximize, MoveHorizontal, MoveVertical, 
    Clock, Cog, Factory, ClipboardSignature, Disc3, SwatchBook, Scaling, Cylinder
} from 'lucide-react';

type SpecTabsProps = {
    car: Car;
};

// (Icon map remains the same)
const iconMap = {
    // Overview
    Make: <Factory className="w-5 h-5 mr-2 text-gray-500" />,
    Model: <ClipboardSignature className="w-5 h-5 mr-2 text-gray-500" />,
    Year: <Calendar className="w-5 h-5 mr-2 text-gray-500" />,
    Mileage: <Gauge className="w-5 h-5 mr-2 text-blue-500" />,
    'Body Style': <CarIcon className="w-5 h-5 mr-2 text-indigo-500" />,
    Color: <Palette className="w-5 h-5 mr-2 text-pink-500" />,
    'Interior Color': <Palette className="w-5 h-5 mr-2 text-fuchsia-500" />,
    'Interior Material': <SwatchBook className="w-5 h-5 mr-2 text-gray-500" />,
    Doors: <DoorOpen className="w-5 h-5 mr-2 text-amber-500" />,
    Wheel: <Disc3 className="w-5 h-5 mr-2 text-gray-500" />,
    'VIN': <Hash className="w-5 h-5 mr-2 text-red-500" />,
    'Stock #': <Hash className="w-5 h-5 mr-2 text-teal-500" />,
    'Paint Code': <Paintbrush className="w-5 h-5 mr-2 text-purple-500" />,
    
    // Performance
    Horsepower: <Zap className="w-5 h-5 mr-2 text-yellow-500" />,
    'Engine Volume': <Scaling className="w-5 h-5 mr-2 text-orange-500" />,
    Cylinders: <Cylinder className="w-5 h-5 mr-2 text-gray-500" />,
    Transmission: <SlidersHorizontal className="w-5 h-5 mr-2 text-purple-500" />,
    'Drive Wheels': <ChevronsRightLeft className="w-5 h-5 mr-2 text-lime-500" />,
    'Top Speed': <Gauge className="w-5 h-5 mr-2 text-red-500" />,
    '0-60 mph': <Clock className="w-5 h-5 mr-2 text-blue-500" />,
    'Engine Code': <Cog className="w-5 h-5 mr-2 text-gray-500" />,
    'Fuel Type': <Fuel className="w-5 h-5 mr-2 text-green-500" />,

    // Dimensions
    Length: <MoveHorizontal className="w-5 h-5 mr-2 text-sky-500" />,
    Width: <MoveHorizontal className="w-5 h-5 mr-2 text-sky-500" />,
    Height: <MoveVertical className="w-5 h-5 mr-2 text-sky-500" />,
    Wheelbase: <Maximize className="w-5 h-5 mr-2 text-sky-500" />,
    'Cargo Capacity': <Box className="w-5 h-5 mr-2 text-amber-600" />,
    'Ground Clearance': <ArrowUp className="w-5 h-5 mr-2 text-green-600" />,
};

const SpecItem = ({ label, value }: { label: keyof typeof iconMap | string; value: string | number | boolean | null | undefined }) => {
    if (value === null || value === undefined || value === '') return null;
    const icon = label in iconMap ? iconMap[label as keyof typeof iconMap] : <div className="w-5 h-5 mr-2" />;
    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
            {icon}
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-semibold break-all">{String(value)}</p>
            </div>
        </div>
    );
};

const FeatureList = ({ items }: { items: string[] }) => (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
            <li key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

export default function SpecTabs({ car }: SpecTabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { id: 'performance', label: 'Performance' },
        { id: 'dimensions', label: 'Dimensions' },
        { id: 'features', label: 'Features' },
    ];

    const handlers = useSwipeable({
        onSwipedLeft: () => setActiveTab((prev) => (prev + 1) % tabs.length),
        onSwipedRight: () => setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    const renderContent = () => {
        const currentTabId = tabs[activeTab].id;
        switch (currentTabId) {
            case 'performance':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <SpecItem label="Horsepower" value={car.horsepower ? `${car.horsepower} hp` : null} />
                        <SpecItem label="Engine Volume" value={car.engineVolume ? `${car.engineVolume}L` : null} />
                        <SpecItem label="Cylinders" value={car.cylinders} />
                        <SpecItem label="Transmission" value={car.transmission} />
                        <SpecItem label="Drive Wheels" value={car.driveWheels} />
                        <SpecItem label="Top Speed" value={car.topSpeed ? `${car.topSpeed} mph` : null} />
                        <SpecItem label="0-60 mph" value={car.zeroToSixty ? `${car.zeroToSixty}s` : null} />
                        <SpecItem label="Engine Code" value={car.engineCode} />
                    </div>
                );
            case 'dimensions':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <SpecItem label="Length" value={car.length ? `${car.length} in` : null} />
                        <SpecItem label="Width" value={car.width ? `${car.width} in` : null} />
                        <SpecItem label="Height" value={car.height ? `${car.height} in` : null} />
                        <SpecItem label="Wheelbase" value={car.wheelbase ? `${car.wheelbase} in` : null} />
                        <SpecItem label="Cargo Capacity" value={car.cargoCapacity ? `${car.cargoCapacity} cu ft` : null} />
                        <SpecItem label="Ground Clearance" value={car.groundClearance ? `${car.groundClearance} in` : null} />
                    </div>
                );
            case 'features':
                return (
                    <div className="space-y-6">
                        {car.comfort.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Comfort</h3>
                                <FeatureList items={car.comfort} />
                            </div>
                        )}
                        {car.safety.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Safety</h3>
                                <FeatureList items={car.safety} />
                            </div>
                        )}
                        {car.multimedia.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Multimedia</h3>
                                <FeatureList items={car.multimedia} />
                            </div>
                        )}
                        {car.other.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Other</h3>
                                <FeatureList items={car.other} />
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(index)}
                            className={`${
                                activeTab === index
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div {...handlers} className="overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
}
