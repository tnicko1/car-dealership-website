import prisma from "@/lib/prisma";
import TestimonialForm from '@/components/TestimonialForm';

export default async function TestimonialsPage() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8">Manage Testimonials</h1>
            <TestimonialForm />
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Existing Testimonials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                            <p className="text-lg font-semibold">{testimonial.name}</p>
                            <p className="text-gray-600 mt-2">{testimonial.testimonial}</p>
                            <p className="text-yellow-500 mt-2">Rating: {testimonial.rating}/5</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
