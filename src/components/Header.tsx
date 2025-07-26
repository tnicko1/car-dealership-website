'use client';

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import AuthButtons from "./AuthButtons"; // Import the auth buttons

export default function Header() {
    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-colors">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                    YourDealership
                </Link>
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        Home
                    </Link>
                    <Link href="/cars" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        Inventory
                    </Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        About Us
                    </Link>
                    <Link href="/wishlist" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        Wishlist
                    </Link>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <AuthButtons /> {/* Add the auth buttons here */}
                    {/* Mobile Menu Button can be added here later */}
                </div>
            </div>
        </header>
    );
}
