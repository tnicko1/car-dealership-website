import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CarDetailsClient from '@/components/CarDetailsClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import type { Metadata } from 'next';

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const car = await prisma.car.findUnique({
        where: { id: params.id },
        include: { images: true },
    });

    if (!car) {
        return {
            title: 'Car Not Found',
        };
    }

    const title = `${car.year} ${car.make} ${car.model} for Sale`;
    const description = `View details for the ${car.year} ${car.make} ${car.model}, priced at ${car.price.toLocaleString()}.`;
    const imageUrl = car.images[0]?.url || '/showroom-bg.png';

    // Structured Data (JSON-LD) for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: title,
        image: imageUrl,
        brand: {
            '@type': 'Brand',
            name: car.make,
        },
        model: car.model,
        productionDate: car.year.toString(),
        vehicleEngine: {
            '@type': 'EngineSpecification',
            fuelType: car.fuelType,
            engineDisplacement: car.engineVolume ? `${car.engineVolume} L` : undefined,
        },
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: car.mileage,
            unitCode: 'SMI', // US Statute Mile
        },
        offers: {
            '@type': 'Offer',
            price: car.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
    };

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        // Inject the JSON-LD script into the head
        other: {
            'script:ld+json': JSON.stringify(jsonLd),
        },
    };
}


export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const [car, user] = await Promise.all([
        prisma.car.findUnique({
            where: { id: params.id },
            include: {
                images: true,
                owner: {
                                        select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        image: true,
                        username: true,
                        reviewsAsSeller: true,
                    }
                }
            },
        }),
        session?.user?.id ? prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wishlist: { select: { id: true } } },
        }) : null
    ]);

    if (!car) {
        notFound();
    }

    const similarCars = await prisma.car.findMany({
        where: {
            bodyStyle: car.bodyStyle,
            id: { not: car.id },
        },
        take: 5,
        include: { images: true },
    });

    const isWishlisted = user?.wishlist.some(item => item.id === car.id) || false;

    const ownerName = car.owner ? `${car.owner.firstName} ${car.owner.lastName}` : 'N/A';
    const carWithOwnerName = {
        ...car,
        owner: car.owner ? { ...car.owner, name: ownerName } : null,
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <CarDetailsClient car={carWithOwnerName} isWishlisted={isWishlisted} similarCars={similarCars} />
        </div>
    );
}
