'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = event;
        const maxRadius = Math.hypot(
            Math.max(clientX, window.innerWidth - clientX),
            Math.max(clientY, window.innerHeight - clientY)
        );

        // Check if the browser supports the View Transitions API
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }

        document.startViewTransition(async () => {
            await toggleTheme();
        });
    };

    return (
        <button
            onClick={handleThemeToggle}
            className="w-12 h-12 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm border border-white/20 dark:border-black/20 rounded-full flex items-center justify-center text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-all hover:scale-110"
            aria-label="Toggle theme"
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                <Sun
                    className={`absolute transition-all duration-500 transform ${
                        theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
                    }`}
                />
                <Moon
                     className={`absolute transition-all duration-500 transform ${
                        theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-50 opacity-0'
                    }`}
                />
            </div>
        </button>
    );
}