'use client';

import { addTestimonial } from '@/actions/testimonialActions';

export default function TestimonialForm() {
    return (
        <form action={addTestimonial} className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Add New Testimonial</h2>
            <input type="text" name="name" placeholder="Customer Name" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <textarea name="testimonial" placeholder="Testimonial" required className="p-2 border rounded w-full h-24 dark:bg-gray-700 dark:border-gray-600"></textarea>
            <input type="number" name="rating" min="1" max="5" placeholder="Rating (1-5)" required className="p-2 border rounded w-full dark:bg-gray-700 dark:border-gray-600" />
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                Add Testimonial
            </button>
        </form>
    );
}
