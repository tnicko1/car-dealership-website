'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function AuthButtons() {
    const { data: session } = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (session) {
        return (
            <div className="flex items-center gap-4">
                <Link href="/admin" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    {session.user?.role === 'admin' ? 'Admin' : 'Add Car'}
                </Link>
                <div className="md:hidden">
                    <Link href="/my-listings" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                        My Listings
                    </Link>
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                    {session.user?.name}
                </span>
                <Image
                    src={session.user?.image ?? ''}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <button onClick={() => signOut()} className="text-sm font-medium hover:underline">
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium hover:underline">
                Sign In
            </button>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
