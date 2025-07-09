import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AppSessionProvider from "@/providers/SessionProvider"; // Import the new provider

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
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body className="font-sans bg-gray-50 dark:bg-gray-900">
        <AppSessionProvider> {/* Wrap everything */}
            <ThemeProvider>
                <Header />
                <main>{children}</main>
                <Footer />
            </ThemeProvider>
        </AppSessionProvider>
        </body>
        </html>
    );
}
