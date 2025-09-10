'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { getTestimonials } from '@/actions/testimonialActions';

type Testimonial = {
    id: string;
    name: string;
    testimonial: string;
    rating: number;
};

const TestimonialSkeleton = () => (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6 mb-4"></div>
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
        <div className="flex items-center mt-2">
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
            <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 4000 })]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            setIsLoading(true);
            const data = await getTestimonials();
            setTestimonials(data);
            setIsLoading(false);
        };
        fetchTestimonials();
    }, []);

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    What Our Customers Say
                </h2>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialSkeleton />
                        <TestimonialSkeleton />
                        <TestimonialSkeleton />
                    </div>
                ) : (
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {testimonials.map(testimonial => (
                                <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] p-4">
                                    <div className="bg-gray-100 p-8 rounded-lg shadow-md h-full flex flex-col">
                                        <p className="text-gray-600 mb-4 flex-grow">"{testimonial.testimonial}"</p>
                                        <div>
                                            <p className="font-bold text-lg text-gray-900">{testimonial.name}</p>
                                            <div className="flex items-center mt-2">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.24 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}