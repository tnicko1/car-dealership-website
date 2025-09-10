import AdminForm from "@/components/AdminForm";
import { getAllMakes } from "@/lib/carData";

export default async function AddCarPage() {
    const makes = await getAllMakes();
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Add Your Car for Sale
            </h1>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
                Fill out the details below to list your vehicle on our platform.
            </p>
            <div className="max-w-4xl mx-auto">
                <AdminForm makes={makes} />
            </div>
        </div>
    );
}
