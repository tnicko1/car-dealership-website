'use client';

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                                <button type="submit" className="w-full bg-primary text-white py-3 px-6 rounded-md font-bold hover:bg-primary-700 transition-colors">
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
                                <p className="text-gray-600 dark:text-gray-400">Parts: (123) 456-7892</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Hours of Operation</h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2">Monday - Friday: 9:00 AM - 8:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Saturday: 9:00 AM - 6:00 PM</p>
                                <p className="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
                            </div>
                            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019590399846!2d-122.4194154846813!3d37.77492957975849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d6a6a53d%3A0x49b5c2d3f7e8f2f!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1629824248629!5m2!1sen!2sus"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}