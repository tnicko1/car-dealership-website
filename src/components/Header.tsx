'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Add/remove class to body to prevent scrolling & add blur when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('overflow-hidden', 'menu-open');
        } else {
            document.body.classList.remove('overflow-hidden', 'menu-open');
        }
        // Cleanup on component unmount
        return () => {
            document.body.classList.remove('overflow-hidden', 'menu-open');
        };
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/cars', label: 'Inventory' },
        { href: '/about', label: 'About Us' },
        { href: '/wishlist', label: 'Wishlist' },
        ...(session ? [{ href: '/my-listings', label: 'My Listings' }] : []),
        { href: '/contact', label: 'Contact' },
    ];

    const headerClasses = `
        sticky top-0 z-50 transition-all duration-300
        ${isMenuOpen
? 'bg-white dark:bg-gray-900 shadow-md'
: isScrolled
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md'
    : 'bg-transparent'
}
    `;

    const linkClasses = (href: string) => `
        relative font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap
        transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400
        after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
        after:w-full after:h-[2px] after:bg-blue-600 dark:after:bg-blue-400
        after:transition-transform after:duration-300
        ${pathname === href ? 'after:scale-x-100' : 'after:scale-x-0'}
        hover:after:scale-x-100
    `;

    return (
        <header className={headerClasses}>
            {/* Main Header Bar - Hidden when mobile menu is open */}
            <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                    YourDealership
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side icons */}
                <div className="hidden md:flex items-center gap-4">
                    <ThemeSwitcher />
                    <UserMenu />
                </div>
            </div>

            {/* Mobile Menu Button - Always present on mobile, positioned absolutely */}
            <div className="md:hidden absolute top-4 right-4 flex items-center gap-2 z-50">
                <ThemeSwitcher />
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)} 
                    className="text-gray-800 dark:text-gray-200"
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`md:hidden fixed top-0 left-0 w-full h-full bg-white dark:bg-gray-900 z-40 transition-opacity duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            >
                <div className={`container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 h-full flex flex-col transition-opacity duration-300 delay-100 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
                    <nav className="flex flex-col items-center space-y-6 text-xl">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto pt-8 flex justify-center">
                        <UserMenu />
                    </div>
                </div>
            </div>
        </header>
    );
}
