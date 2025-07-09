'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthButtons() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="flex items-center gap-4">
                {session.user?.role === 'admin' && (
                    <Link href="/admin" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        Admin
                    </Link>
                )}
                <span className="text-sm font-medium">
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
        <button onClick={() => signIn('github')} className="text-sm font-medium hover:underline">
            Sign In with GitHub
        </button>
    );
}
