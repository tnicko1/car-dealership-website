import prisma from '@/lib/prisma';

export default async function Testimonials() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3,
    });

    return (
        <section className="bg-white dark:bg-gray-800 py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                    What Our Customers Say
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-md">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.testimonial}"</p>
                            <p className="font-bold text-lg">{testimonial.name}</p>
                            <div className="flex items-center mt-2">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.24 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
