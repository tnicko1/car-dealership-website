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

    // Define styles for the heading and paragraph
    const createTextStyle = (baseColor: string, highlightColor: string) => {
        const size = isHovering ? '300px' : '0px';
        const halfSize = isHovering ? 150 : 0;

        return {
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            backgroundImage: `
                radial-gradient(circle, ${highlightColor} 50%, transparent 51%),
                linear-gradient(${baseColor}, ${baseColor})
            `,
            backgroundSize: `${size} ${size}, 100% 100%`,
            backgroundPosition: `
                calc(var(--mouse-x) - ${halfSize}px) calc(var(--mouse-y) - ${halfSize}px),
                0 0
            `,
            backgroundRepeat: 'no-repeat, no-repeat',
            backgroundClip: 'text, text',
            WebkitBackgroundClip: 'text, text',
            color: 'transparent',
            transition: 'background-size 0.3s ease-out',
        } as React.CSSProperties;
    };

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
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
                        style={!isTouchDevice ? createTextStyle('#FFFFFF', '#F87171') : {}}
                    >
                        Find Your Next Dream Car
                    </h1>
                    <p
                        className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
                        style={!isTouchDevice ? createTextStyle('#D1D5DB', '#FCA5A5') : {}}
                    >
                        We offer a curated selection of high-quality new and pre-owned vehicles. Your journey to the perfect ride starts here.
                    </p>
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