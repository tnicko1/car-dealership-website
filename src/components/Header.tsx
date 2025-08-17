'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md' : 'bg-transparent'}
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                {/* Left Section: Logo */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                        YourDealership
                    </Link>
                </div>

                {/* Center Section: Navigation */}
                <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Section: Theme Switcher and Auth */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    <ThemeSwitcher />
                    <UserMenu />
                </div>
            </div>
        </header>
    );
}