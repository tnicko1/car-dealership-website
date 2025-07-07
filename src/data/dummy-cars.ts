import { Car } from '@/types/car';

export const DUMMY_CARS: Car[] = [
    {
        id: '1',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        price: 25000,
        imageUrl: 'https://placehold.co/600x400/cccccc/ffffff?text=Toyota+Camry',
        description: 'A reliable and fuel-efficient sedan, perfect for families and commuters.',
        features: ['Bluetooth', 'Backup Camera', 'Lane Assist'],
    },
    {
        id: '2',
        make: 'Ford',
        model: 'Mustang',
        year: 2023,
        price: 45000,
        imageUrl: 'https://placehold.co/600x400/000000/ffffff?text=Ford+Mustang',
        description: 'Experience the thrill of American muscle with this iconic sports car.',
        features: ['V8 Engine', 'Leather Seats', 'Premium Sound System'],
    },
    {
        id: '3',
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        price: 28000,
        imageUrl: 'https://placehold.co/600x400/999999/ffffff?text=Honda+CR-V',
        description: 'A versatile and spacious SUV with all-wheel drive.',
        features: ['All-Wheel Drive', 'Sunroof', 'Heated Seats'],
    },
];
