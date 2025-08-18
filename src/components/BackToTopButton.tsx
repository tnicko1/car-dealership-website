'use client';

import { useState, useEffect } from 'react';

export default function BackToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`
                fixed bottom-5 right-5 p-3 rounded-full bg-primary text-white
                hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-primary-500 transition-all duration-300 z-[100]
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            `}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        </button>
    );
}
