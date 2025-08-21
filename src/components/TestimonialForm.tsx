'use client';

import { addTestimonial } from '@/actions/testimonialActions';

export default function TestimonialForm() {
    return (
        <form action={addTestimonial} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Add New Testimonial</h2>
            <div>
                <label htmlFor="name" className="sr-only">Customer Name</label>
                <input id="name" type="text" name="name" placeholder="Customer Name" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div>
                <label htmlFor="testimonial" className="sr-only">Testimonial</label>
                <textarea id="testimonial" name="testimonial" placeholder="Testimonial" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            </div>
            <div>
                <label htmlFor="rating" className="sr-only">Rating</label>
                <input id="rating" type="number" name="rating" min="1" max="5" placeholder="Rating (1-5)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-700 transition-colors">
                Add Testimonial
            </button>
        </form>
    );
}
