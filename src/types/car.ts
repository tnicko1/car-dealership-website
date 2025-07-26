import type { Car, CarImage } from '@prisma/client';

export type { Car, CarImage };
export type CarWithImages = Car & {
    images: CarImage[];
};