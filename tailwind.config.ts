import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        screens: {
            'sm': '640px',
            'md': '992px', // Increased from 768px
            'lg': '1280px',
            'xl': '1536px',
        },
        extend: {
            // Add custom animations and keyframes
            keyframes: {
                shine: {
                    '0%': { 'background-position': '100%' },
                    '100%': { 'background-position': '-100%' },
                },
                'button-glow': {
                    '0%, 100%': { boxShadow: '0 0 6px 1px #DC2626' },
                    '50%': { boxShadow: '0 0 12px 3px #B91C1C' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            animation: {
                shine: 'shine 5s linear infinite',
                'button-glow': 'button-glow 3s infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-in-up': 'slideInUp 0.5s ease-out forwards',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: {
                    DEFAULT: '#DC2626', // Red-600
                    '50': '#FEF2F2',
                    '100': '#FEE2E2',
                    '200': '#FECACA',
                    '300': '#FCA5A5',
                    '400': '#F87171',
                    '500': '#EF4444',
                    '600': '#DC2626',
                    '700': '#B91C1C',
                    '800': '#991B1B',
                    '900': '#7F1D1D',
                    '950': '#450A0A',
                },
                silver: {
                    DEFAULT: '#E5E7EB', // Gray-200
                    '50': '#F9FAFB',
                    '100': '#F3F4F6',
                    '200': '#E5E7EB',
                    '300': '#D1D5DB',
                    '400': '#9CA3AF',
                    '500': '#6B7280',
                    '600': '#4B5563',
                    '700': '#374151',
                    '800': '#1F2937',
                    '900': '#111827',
                    '950': '#030712',
                }
            }
        },
    },
    plugins: [],
};
export default config;
