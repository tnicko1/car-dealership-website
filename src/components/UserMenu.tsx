'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, User, Settings, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';

export default function UserMenu() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
                <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    <LogIn className="w-5 h-5" />
                    Login
                </button>
                <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
            </>
        );
    }

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2">
                <Image
                    src={session.user?.image || 'https://placehold.co/40x40'}
                    alt={session.user?.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <span className="hidden md:block font-semibold">{session.user?.name}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link href="/account" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                    </Link>
                    <button
                        onClick={() => signOut()}
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
