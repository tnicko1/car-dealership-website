'use client';

import Link from 'next/link';
import { useRef } from 'react';
import VariableProximity from './VariableProximity';
import Image from 'next/image';
import SearchBar from './SearchBar';

export default function HeroSection() {
    const containerRef = useRef(null);

    return (
        <section
            ref={containerRef}
            className="relative text-center py-20 md:py-32 text-white overflow-hidden h-[60vh] flex flex-col justify-center items-center"
        >
            <div className="absolute inset-0">
                <Image
                    src="/hero-background.avif"
                    alt="Luxury cars in a modern dealership"
                    fill
                    className="object-cover animate-ken-burns blur-sm"
                    priority
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-red-700/10"></div>

            <div className="relative container mx-auto px-4 z-10">
                <h1 className="font-roboto-flex text-5xl md:text-7xl font-bold text-white mb-4">
                    <VariableProximity
                        label="Find Your Dream Car"
                        fromFontVariationSettings="'wght' 400, 'opsz' 9"
                        toFontVariationSettings="'wght' 1000, 'opsz' 40"
                        containerRef={containerRef}
                        radius={200}
                        falloff="linear"
                    />
                </h1>
                <VariableProximity
                    label="We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here."
                    className="font-roboto-flex text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto block"
                    fromFontVariationSettings="'wght' 400, 'opsz' 9"
                    toFontVariationSettings="'wght' 1000, 'opsz' 40"
                    containerRef={containerRef}
                    radius={150}
                    falloff='linear'
                />
                <div className="mt-12">
                    <SearchBar />
                </div>
                <div className="mt-8">
                     <Link
                        href="/cars"
                        className="text-white font-semibold hover:underline transition-all duration-300 ease-in-out inline-block"
                    >
                        Or browse all vehicles
                    </Link>
                </div>
            </div>
        </section>
    );
}
