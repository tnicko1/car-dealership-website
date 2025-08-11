import prisma from '@/lib/prisma';
import Image from 'next/image';
import CarCard from "@/components/CarCard";
import Testimonials from '@/components/Testimonials';
import type { CarWithImages } from '@/types/car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const session = await getServerSession(authOptions);

    const [featuredCars, user] = await Promise.all([
        prisma.car.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        }),
        session?.user?.id ? prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wishlist: { select: { id: true } } },
        }) : null
    ]);

    const wishlistedCarIds = user?.wishlist.map(car => car.id) || [];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative text-center py-20 md:py-32 text-white overflow-hidden">
                <Image
                    src="/showroom-bg.png"
                    alt="A modern car showroom"
                    fill
                    style={{objectFit: 'cover'}}
                    priority
                    className="-z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70 -z-10"></div>

                <div className="relative container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-slide-in-up [animation-delay:0.1s]">
                        Find Your Next Dream Car
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-in-up [animation-delay:0.2s]">
                        We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here.
                    </p>
                    <a
                        href="/cars"
                        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 ease-in-out inline-block animate-slide-in-up [animation-delay:0.3s]"
                    >
                        Explore Inventory
                    </a>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section id="featured-cars" className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="animate-slide-in-up">
                        <h2 className="section-title">Featured Vehicles</h2>
                        <p className="section-subtitle">Hand-picked models we think you will love.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCars.map((car, index) => (
                            <div key={car.id} className="animate-slide-in-up" style={{animationDelay: `${0.1 * (index + 1)}s`}}>
                                <CarCard car={car} isWishlisted={wishlistedCarIds.includes(car.id)} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Testimonials />

            {/* Payment Information Section */}
            <section className="py-16 sm:py-24 bg-white dark:bg-gray-800/50">
                <div className="container mx-auto px-4 animate-slide-in-up">
                    <h2 className="section-title">Flexible Payment Options</h2>
                    <p className="section-subtitle">We make ownership easy and accessible.</p>
                    <div className="max-w-3xl mx-auto text-center text-gray-700 dark:text-gray-300">
                        <p>
                            While the final purchase is completed at our showroom, we want you to be fully prepared. We proudly accept all major credit and debit cards. Furthermore, our dedicated finance team is here to help you explore competitive financing plans tailored to your budget. Visit us to discuss your options with an expert.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}