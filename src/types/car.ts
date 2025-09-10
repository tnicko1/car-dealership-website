import type { Car, CarImage, Review } from '@prisma/client';

export type { Car, CarImage };

export type CarWithImages = Car & {
    images: CarImage[];
};

export type CarWithOwnerAndImages = Car & {
    images: CarImage[];
    owner?: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        image: string | null;
        username: string | null;
        reviewsAsSeller?: Review[];
    } | null;
};
