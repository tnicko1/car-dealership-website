'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// You can replace these with your actual social media links
const socialLinks = [
    { name: 'Facebook', href: '#', icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg> },
    { name: 'Twitter', href: '#', icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
    { name: 'Instagram', href: '#', icon: (props: any) => <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.465c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 0C9.58 0 9.22.01 8.134.059 7.028.108 6.054.287 5.158.623a6.89 6.89 0 00-2.592 1.658A6.89 6.89 0 00.908 4.874c-.336.9-.515 1.874-.564 2.98C.302 8.94 0 9.298 0 11.718s.01 2.778.059 3.866c.049 1.106.228 2.08.564 2.98a6.89 6.89 0 001.658 2.592 6.89 6.89 0 002.592 1.658c.9.336 1.874.515 2.98.564 1.086.049 1.444.059 3.866.059s2.78-.01 3.866-.059c1.106-.049 2.08-.228 2.98-.564a6.89 6.89 0 002.592-1.658 6.89 6.89 0 001.658-2.592c.336-.9.515-1.874.564-2.98.049-1.086.059-1.444.059-3.866s-.01-2.778-.059-3.866c-.049-1.106-.228-2.08-.564-2.98A6.89 6.89 0 0020.126 2.28a6.89 6.89 0 00-2.592-1.658c-.9-.336-1.874-.515-2.98-.564C14.78 0 14.42 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" clipRule="evenodd" /></svg> },
];

export default function Footer() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <footer className="bg-gray-900 text-gray-400 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center md:text-left grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold text-white mb-4">YourDealership</h3>
                        <p className="max-w-md mx-auto md:mx-0">
                            Your premier destination for quality vehicles and exceptional service. We are committed to helping you find the car that is right for you.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4 mt-6">
                            {socialLinks.map((item) => (
                                <a key={item.name} href={item.href} className="hover:text-white transition-colors">
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/cars" className="hover:text-white transition-colors">Inventory</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-2">
                            <li>123 Car Lane, Auto City</li>
                            <li>Phone: (123) 456-7890</li>
                            <li>Email: sales@yourdealership.com</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                    <p>&copy; {new Date().getFullYear()} YourDealership. All Rights Reserved.</p>
                </div>
            </div>
            
            </footer>
    );
}