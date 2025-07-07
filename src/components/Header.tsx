'use client';

import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher"; // Make sure this import is present

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
                    <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center">
                    {/* This is where the ThemeSwitcher component is added */}
                    <ThemeSwitcher />

                    {/* Basic Mobile Menu Button */}
                    <div className="md:hidden ml-4">
                        <button className="text-gray-600 dark:text-gray-300 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
