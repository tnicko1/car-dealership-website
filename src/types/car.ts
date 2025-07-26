import type { Car, CarImage } from '@prisma/client';

export type CarWithImages = Car & {
    images: CarImage[];
};