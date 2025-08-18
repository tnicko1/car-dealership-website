'use client';

import { signIn } from 'next-auth/react';
import { Github, Chrome, Mail } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Sign in to your account
                    </h2>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => signIn('github', { callbackUrl: '/' })}
                        className="w-full inline-flex justify-center items-center gap-3 rounded-md border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        <Github className="w-5 h-5" />
                        Sign in with GitHub
                    </button>
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full inline-flex justify-center items-center gap-3 rounded-md border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        <Chrome className="w-5 h-5" />
                        Sign in with Google
                    </button>
                    <button
                        onClick={() => signIn('email', { callbackUrl: '/' })}
                        className="w-full inline-flex justify-center items-center gap-3 rounded-md border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                        <Mail className="w-5 h-5" />
                        Sign in with Email
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm font-medium text-primary hover:text-primary-700 dark:hover:text-primary-500">
                        Cancel and go back
                    </Link>
                </div>
            </div>
        </div>
    );
}
