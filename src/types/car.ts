import type { Car, CarImage } from '@prisma/client';

export type { Car, CarImage };

export type CarWithImages = Car & {
    images: CarImage[];
};

export type CarWithOwnerAndImages = Car & {
    images: CarImage[];
    owner?: {
        name: string | null;
        email: string | null;
        phone: string | null;
        image: string | null;
    } | null;
};
