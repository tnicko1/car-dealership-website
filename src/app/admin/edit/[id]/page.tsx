'use client';

import EditFormWrapper from "@/components/EditFormWrapper";

export default function EditCarPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Edit Car</h1>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <EditFormWrapper id={params.id} />
            </div>
        </div>
    );
}