'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, User, Settings, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';
import { usePathname } from 'next/navigation';

export default function UserMenu({ direction = 'down' }: { direction?: 'up' | 'down' }) {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Close dropdown on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (status === 'loading') {
        return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
    }

    if (!session) {
        return (
            <>
                {/* Mobile: Link to login page */}
                <Link
                    href="/login"
                    className="md:hidden flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    <LogIn className="w-5 h-5" />
                    Login
                </Link>

                {/* Desktop: Button to open modal */}
                <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="hidden md:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                    <LogIn className="w-5 h-5" />
                    Login
                </button>
                <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            </>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
                <Image
                    src={session.user?.image || 'https://placehold.co/40x40'}
                    alt={session.user?.username || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <span className="hidden md:block font-semibold">{session.user?.username}</span>
            </button>

            {isOpen && (
                <div className={`absolute right-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 ${direction === 'up' ? 'bottom-full mb-2' : 'mt-2'}`}>
                    <Link href="/account" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                    </Link>
                    {session.user.role === 'admin' && (
                        <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <User className="w-4 h-4 mr-2" />
                            Admin Panel
                        </Link>
                    )}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            signOut();
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
