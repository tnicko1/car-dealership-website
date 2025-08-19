'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchDevice || !heroRef.current) return;
        heroRef.current.style.setProperty('--mouse-x', `${e.clientX - heroRef.current.getBoundingClientRect().left}px`);
        heroRef.current.style.setProperty('--mouse-y', `${e.clientY - heroRef.current.getBoundingClientRect().top}px`);
    };

    const handleMouseLeave = () => {
        if (isTouchDevice || !heroRef.current) return;
        heroRef.current.style.removeProperty('--mouse-x');
        heroRef.current.style.removeProperty('--mouse-y');
    };

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative text-center py-20 md:py-32 text-white overflow-hidden"
        >
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/showroom-bg.webp"
                    alt="A modern car showroom"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="opacity-80"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70"></div>

            <div className="relative container mx-auto px-4">
                <h1
                    className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 ${!isTouchDevice ? 'hero-text-glow' : ''}`}
                >
                    Find Your Next Dream Car
                </h1>
                <p
                    className={`text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto ${!isTouchDevice ? 'hero-text-glow' : ''}`}
                >
                    We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here.
                </p>
                <Link
                    href="/cars"
                    className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-500 transform hover:scale-105 transition-all duration-300 ease-in-out inline-block animate-button-glow"
                >
                    Explore Inventory
                </Link>
            </div>
        </section>
    );
}
