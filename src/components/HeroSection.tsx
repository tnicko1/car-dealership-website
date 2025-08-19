'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
    const [isHovering, setIsHovering] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchDevice || !heroRef.current) return;
        setIsHovering(true);
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseLeave = () => {
        if (isTouchDevice) return;
        setIsHovering(false);
    };

    const maskStyle = {
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
        maskImage: 'radial-gradient(circle 150px at var(--mouse-x) var(--mouse-y), black 100%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle 150px at var(--mouse-x) var(--mouse-y), black 100%, transparent 100%)',
    } as React.CSSProperties;

    const transformOrigin = `${mousePosition.x}px ${mousePosition.y}px`;

    return (
        <section
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
                <div
                    ref={heroRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                >
                    {/* Masked (Top) Layer */}
                    {!isTouchDevice && (
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                ...maskStyle,
                                transformOrigin: transformOrigin,
                                transform: isHovering ? 'scale(1)' : 'scale(0)',
                                transition: 'transform 0.3s ease-out',
                            }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-primary-400" style={{ transform: 'scale(1.02)'}}>
                                Find Your Next Dream Car
                            </h1>
                            <p className="text-lg md:text-xl text-primary-300 mb-8 max-w-3xl mx-auto" style={{ transform: 'scale(1.02)'}}>
                                We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here.
                            </p>
                        </div>
                    )}

                    {/* Base (Bottom) Layer */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                            Find Your Next Dream Car
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here.
                        </p>
                    </div>
                </div>

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