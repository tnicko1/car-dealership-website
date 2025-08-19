import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { default as dynamicImport } from 'next/dynamic';

// Dynamically import components that are not visible on initial load
const Testimonials = dynamicImport(() => import('@/components/Testimonials'));
const FeaturedSlider = dynamicImport(() => import('@/components/FeaturedSlider'));
import HeroSection from '@/components/HeroSection';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const session = await getServerSession(authOptions);

    // Fetch cars and user data in parallel
    const [featuredCars, user] = await Promise.all([
        prisma.car.findMany({
            take: 6, // Fetch more cars for a better slider experience
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        }),
        session?.user?.id ? prisma.user.findUnique({
            where: { id: session.user.id },
            select: { wishlist: { select: { id: true } } },
        }) : null
    ]);

    const wishlistedCarIds = user?.wishlist.map(car => car.id) || [];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Cars Section */}
            <section id="featured-cars" className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Featured Vehicles</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Hand-picked models we think you will love.</p>
                    </div>
                    <FeaturedSlider cars={featuredCars} wishlistedCarIds={wishlistedCarIds} />
                </div>
            </section>

            <Testimonials />

            {/* Payment Information Section */}
            <section className="py-16 sm:py-24 bg-white dark:bg-gray-800/50">
                <div className="container mx-auto px-4 text-center animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Flexible Payment Options</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">We make ownership easy and accessible.</p>
                    <div className="max-w-3xl mx-auto mt-4 text-gray-700 dark:text-gray-300">
                        <p>
                            While the final purchase is completed at our showroom, we want you to be fully prepared. We proudly accept all major credit and debit cards. Furthermore, our dedicated finance team is here to help you explore competitive financing plans tailored to your budget. Visit us to discuss your options with an expert.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
