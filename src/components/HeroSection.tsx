'use client';

import Link from 'next/link';
import CurvedLoop from './CurvedLoop';

export default function HeroSection() {
    return (
        <section
            className="relative text-center pt-8 pb-20 md:pt-16 md:pb-32 text-white overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70"></div>

            <div className="relative container mx-auto px-4">
                <div className="w-full absolute top-0 left-0">
                    <CurvedLoop marqueeText="Find ✦ Your ✦ Next ✦ Dream ✦ Car ✦" />
                </div>
                <div className="mt-32">
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here.
                    </p>

                    <Link
                        href="/cars"
                        className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-500 transform hover:scale-105 transition-all duration-300 ease-in-out inline-block animate-button-glow"
                    >
                        Explore Inventory
                    </Link>
                </div>
            </div>
        </section>
    );
}
