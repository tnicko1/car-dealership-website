'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import { Menu, X } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import { Dialog, Transition } from '@headlessui/react';

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
        { href: '/cars', label: 'Vehicles' },
        { href: '/about', label: 'About Us' },
        { href: '/wishlist', label: 'Wishlist' },
        ...(session ? [{ href: '/my-listings', label: 'My Listings' }] : []),
        { href: '/contact', label: 'Contact' },
    ];

    const headerClasses = `
        sticky top-0 z-50 transition-all duration-300
        ${isMenuOpen
? 'bg-silver-100 dark:bg-gray-900 shadow-md'
: isScrolled
    ? 'bg-silver-100/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md'
    : 'bg-transparent'
}
    `;

    const linkClasses = (href: string) => `
        relative font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap
        transition-colors duration-300 hover:text-primary dark:hover:text-primary-400
        after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
        after:w-full after:h-[2px] after:bg-primary dark:after:bg-primary-400
        after:transition-transform after:duration-300
        ${pathname === href ? 'after:scale-x-100' : 'after:scale-x-0'}
        hover:after:scale-x-100
    `;

    return (
        <header className={headerClasses}>
            {/* Main Header Bar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between" aria-hidden={isMenuOpen}>
                <div className="flex-1">
                    {/* Logo */}
                    <Link href="/" className="flex items-center text-2xl font-bold text-primary dark:text-primary-400 hover:opacity-80 transition-opacity">
                        <AnimatedLogo />
                        <span className="glare-effect text-3xl font-extrabold tracking-tight bg-red-600 dark:bg-red-500 ml-2">TorqueTown</span>
                    </Link>
                </div>


                {/* Desktop Navigation */}
                <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side icons & Mobile menu button */}
                <div className="flex flex-1 justify-end items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeSwitcher />
                        <UserMenu />
                    </div>
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeSwitcher />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-800 dark:text-gray-200"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                        >
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <Transition appear show={isMenuOpen} as={Fragment}>
                <Dialog as="div" className="md:hidden" onClose={setIsMenuOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="ease-in duration-200"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="ml-auto relative w-full max-w-xs h-full bg-white dark:bg-gray-900 shadow-xl flex flex-col">
                                <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
                                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">Menu</Dialog.Title>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-gray-800 dark:text-gray-200"
                                        aria-label="Close menu"
                                    >
                                        <X size={28} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <nav className="flex flex-col items-start space-y-6 text-xl">
                                        {navLinks.map((link) => (
                                            <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                                <div className="mt-auto p-4 border-t dark:border-gray-700">
                                    <UserMenu direction="up" />
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </header>
    );
}
