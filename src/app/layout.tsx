import type { Metadata } from "next";
import { Inter, Roboto_Flex } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppSessionProvider from "@/providers/SessionProvider";
import { CompareProvider } from "@/providers/CompareProvider";
import CompareBar from "@/components/CompareBar";
import BackToTopButton from "@/components/BackToTopButton";
import { MenuProvider } from "@/providers/MenuProvider";
import { ModalProvider } from '@/providers/ModalProvider';
import InquiryModal from '@/components/InquiryModal';
import TestDriveModal from '@/components/TestDriveModal';
import TradeInModal from '@/components/TradeInModal';
import { WebSocketProvider } from '@/providers/WebSocketProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const robotoFlex = Roboto_Flex({ subsets: ['latin'], variable: '--font-roboto-flex' });

export const metadata: Metadata = {
    title: "TorqueTown",
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
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#DC2626" />
            <link rel="icon" href="/icons/favicon.ico" />
            <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
            <title>TorqueTown</title>
            
        </head>
        <body className={`${inter.variable} ${robotoFlex.variable} font-sans bg-gray-50 dark:bg-gray-900`}>
        <AppSessionProvider>
            <WebSocketProvider>
                <CompareProvider>
                    <MenuProvider>
                        <ModalProvider>
                            <Header />
                            <main>{children}</main>
                            <Footer />
                            <CompareBar />
                            <BackToTopButton />
                            <InquiryModal />
                            <TestDriveModal />
                            <TradeInModal />
                        </ModalProvider>
                    </MenuProvider>
                </CompareProvider>
            </WebSocketProvider>
        </AppSessionProvider>
        <div id="modal-root" />
        </body>
        </html>
    );
}
