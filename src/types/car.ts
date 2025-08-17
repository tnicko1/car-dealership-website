import type { Car, CarImage, User } from '@prisma/client';

export type { Car, CarImage };

export type CarWithOwnerAndImages = Car & {
    images: CarImage[];
    owner?: {
        name: string | null;
        email: string | null;
        phone: string | null;
    } | null;
};
