import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            <section className="relative py-24 bg-gray-900 text-white">
                <div className="absolute inset-0 opacity-30">
                    <Image src="/our-dealership.avif" alt="Dealership building" layout="fill" objectFit="cover" />
                </div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold">About YourDealership</h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300">Driving Your Dreams Forward Since 2005</p>
                </div>
            </section>

            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="section-title">Our Story</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Founded in 2005 by a group of passionate car enthusiasts, YourDealership started as a small lot with a big dream: to create a car buying experience that was honest, transparent, and customer-focused. Over the years, we've grown into one of the most trusted dealerships in the region, but our core values remain the same. We believe that everyone deserves to drive a car they love, and we're here to make that happen.
                        </p>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            Our dealership is more than just a place to buy a car. It's a community of car lovers, and we're proud to be a part of it. We host regular events, from classic car shows to new model unveilings, and we're always happy to chat with fellow enthusiasts. Whether you're a seasoned collector or a first-time buyer, you'll find a warm welcome at YourDealership.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-white dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <h2 className="section-title">Meet the Team</h2>
                    <p className="section-subtitle">The dedicated professionals behind your exceptional experience.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                        {/* Team Member Card */}
                        <div className="text-center">
                            <Image src="https://placehold.co/400x400/cccccc/ffffff?text=Team+Member" alt="Team member" width={150} height={150} className="mx-auto rounded-full" />
                            <h3 className="mt-4 text-xl font-bold">John Doe</h3>
                            <p className="text-gray-500">General Manager</p>
                        </div>
                        {/* Team Member Card */}
                        <div className="text-center">
                            <Image src="https://placehold.co/400x400/cccccc/ffffff?text=Team+Member" alt="Team member" width={150} height={150} className="mx-auto rounded-full" />
                            <h3 className="mt-4 text-xl font-bold">Jane Smith</h3>
                            <p className="text-gray-500">Head of Sales</p>
                        </div>
                        {/* Team Member Card */}
                        <div className="text-center">
                            <Image src="https://placehold.co/400x400/cccccc/ffffff?text=Team+Member" alt="Team member" width={150} height={150} className="mx-auto rounded-full" />
                            <h3 className="mt-4 text-xl font-bold">Mike Johnson</h3>
                            <p className="text-gray-500">Finance Expert</p>
                        </div>
                        {/* Team Member Card */}
                        <div className="text-center">
                            <Image src="https://placehold.co/400x400/cccccc/ffffff?text=Team+Member" alt="Team member" width={150} height={150} className="mx-auto rounded-full" />
                            <h3 className="mt-4 text-xl font-bold">Sarah Williams</h3>
                            <p className="text-gray-500">Service Manager</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}