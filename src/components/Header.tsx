'use client';

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ThemeSwitcher from './ThemeSwitcher';
import UserMenu from './UserMenu';
import AnimatedLogo from './AnimatedLogo';
import { Dialog, Transition } from '@headlessui/react';
import AnimatedHamburgerIcon from './AnimatedHamburgerIcon';
import { useMenu } from '@/providers/MenuProvider';

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const { isMenuOpen, toggleMenu } = useMenu();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        if (isMenuOpen) {
            toggleMenu();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Add/remove class to body to prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
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

    const getHeaderClasses = () => {
        const baseClasses = "sticky top-0 z-50 transition-all duration-300 h-20";

        if (isMenuOpen) {
            return `${baseClasses} bg-silver-100 dark:bg-gray-900 shadow-md`;
        }
        if (isScrolled) {
            return `${baseClasses} bg-silver-100/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md`;
        }
        return `${baseClasses} bg-transparent`;
    };

    return (
        <header className={getHeaderClasses()}>
            {/* Main Header Bar */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
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
                    <div className="md:hidden flex items-center">
                        <ThemeSwitcher />
                        <AnimatedHamburgerIcon 
                            isOpen={isMenuOpen} 
                            onClick={toggleMenu}
                            className="text-gray-800 dark:text-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <Transition appear show={isMenuOpen} as={Fragment}>
                <Dialog as="div" className="md:hidden" onClose={toggleMenu}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* This is the overlay */}
                        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <Dialog.Panel className="fixed top-20 right-0 w-full max-w-xs h-[calc(100dvh-5rem)] bg-white dark:bg-gray-900 shadow-xl flex flex-col z-50 overflow-y-auto">
                            <div className="p-6">
                                <nav className="flex flex-col items-start space-y-6 text-xl">
                                    {navLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <div className="mt-auto p-6 border-t dark:border-gray-700">
                                <UserMenu direction="up" />
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </header>
    );
}
