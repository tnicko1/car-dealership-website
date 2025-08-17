import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CarDetailsClient from '@/components/CarDetailsClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export default async function CarDetailsPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const [car, user] = await Promise.all([
        prisma.car.findUnique({
            where: { id: params.id },
            include: { 
                images: true,
                owner: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
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

    const isWishlisted = user?.wishlist.some(item => item.id === car.id) || false;

    return (
        <div className="container mx-auto px-4 py-12">
            <CarDetailsClient car={car} isWishlisted={isWishlisted} />
        </div>
    );
}
