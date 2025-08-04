'use client';

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import AuthButtons from "./AuthButtons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Car } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Inventory" },
    { href: "/about", label: "About Us" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left Section: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                            <Car size={28} />
                            YourDealership
                        </Link>
                    </div>

                    {/* Center Section: Navigation */}
                    <nav className="hidden md:flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-full shadow-inner">
                        {navLinks.map((link) => {
                             const isActive = pathname === link.href;
                             return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow"
                                            : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                             )
                        })}
                    </nav>

                    {/* Right Section: Theme Switcher and Auth */}
                    <div className="flex items-center justify-end gap-4">
                        <ThemeSwitcher />
                        <AuthButtons />
                    </div>
                </div>
            </div>
        </header>
    );
}
