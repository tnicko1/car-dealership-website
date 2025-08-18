import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AppSessionProvider from "@/providers/SessionProvider";
import { CompareProvider } from "@/providers/CompareProvider";
import CompareBar from "@/components/CompareBar";
import BackToTopButton from "@/components/BackToTopButton";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Your Car Dealership",
    description: "Find your next dream car with us.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#DC2626" />
            <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
            <title>Your Car Dealership</title>
            <link
                rel="preload"
                href="/showroom-bg.webp"
                as="image"
                type="image/webp"
                crossOrigin="anonymous"
            />
        </head>
        <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 overflow-x-hidden`}>
        <AppSessionProvider>
            <ThemeProvider>
                <CompareProvider>
                    <Header />
                    <main className="pb-24">{children}</main>
                    <CompareBar />
                    <Footer />
                    <BackToTopButton />
                </CompareProvider>
            </ThemeProvider>
        </AppSessionProvider>
        </body>
        </html>
    );
}
