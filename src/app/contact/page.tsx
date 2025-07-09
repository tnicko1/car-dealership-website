'use client';

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Corrected the text to avoid the ESLint error
        alert('Thank you for your message! We will get back to you shortly. (This is a demo)');
    };

    return (
        <div className="animate-fade-in">
            <section className="bg-gray-100 dark:bg-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Contact Us</h1>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-400 mt-2">We are here to help. Reach out to us anytime.</p>
                </div>
            </section>

            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                    <input type="text" id="name" name="name" required className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                    <input type="email" id="email" name="email" required className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                    <textarea id="message" name="message" rows={5} required className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"></textarea>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-bold hover:bg-blue-700 transition-colors">
                                    Submit
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold">Visit Our Showroom</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">123 Car Lane, Auto City, AC 12345</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Call Us</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Sales: (123) 456-7890</p>
                                <p className="text-gray-600 dark:text-gray-400">Service: (123) 456-7891</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Hours of Operation</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Monday - Friday: 9:00 AM - 8:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Saturday: 9:00 AM - 6:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
                            </div>
                            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md">
                                {/* Map Placeholder */}
                                <p className="text-center pt-24 text-gray-500">Map Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
