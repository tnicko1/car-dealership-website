'use client';

import Link from 'next/link';
import { useRef } from 'react';
import CurvedLoop from './CurvedLoop';
import VariableProximity from './VariableProximity';

export default function HeroSection() {
    const containerRef = useRef(null);

    return (
        <section
            ref={containerRef}
            className="relative text-center py-20 md:py-32 text-white overflow-hidden h-[50vh]"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70"></div>

            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
                <div className="w-full absolute top-[-155px] md:top-[-205px] left-0">
                    <CurvedLoop marqueeText="Find ✦ Your ✦ Next ✦ Dream ✦ Car ✦" />
                </div>
                <div className="mt-16 md:mt-24">
                    <VariableProximity
                        label="We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here."
                        className="font-roboto-flex text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto block"
                        fromFontVariationSettings="'wght' 400, 'opsz' 9"
                        toFontVariationSettings="'wght' 1000, 'opsz' 40"
                        containerRef={containerRef}
                        radius={150}
                        falloff='linear'
                    />
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
