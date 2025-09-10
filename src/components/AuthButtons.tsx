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
                <Link href={session.user?.role === 'admin' ? '/admin' : '/my-listings/add'} className="text-sm font-medium text-primary hover:underline">
                    {session.user?.role === 'admin' ? 'Admin' : 'Add Car'}
                </Link>
                <div className="md:hidden">
                    <Link href="/my-listings" className="text-sm font-medium text-gray-600 hover:text-primary">
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
            {/* Mobile: Link to login page */}
            <Link href="/login" className="text-sm font-medium hover:underline md:hidden">
                Sign In
            </Link>

            {/* Desktop: Button to open modal */}
            <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium hover:underline hidden md:block">
                Sign In
            </button>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
