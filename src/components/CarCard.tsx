import type { CarWithImages } from "@/types/car";
import Link from "next/link";
import Image from "next/image";
import { toggleWishlist } from "@/actions/wishlistActions";
import { useSession } from "next-auth/react";
import { useCompare } from "@/providers/CompareProvider";
import { Heart, Plus } from "lucide-react";

export default function CarCard({ car }: { car: CarWithImages }) {
    const { data: session } = useSession();
    const { addToCompare } = useCompare();

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!session) {
            // You might want to trigger a login modal here
            alert("Please log in to add to wishlist");
            return;
        }
        await toggleWishlist(car.id);
    };

    const handleCompareClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCompare(car);
    };

    return (
        <Link href={`/cars/${car.id}`} className="block w-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 ease-in-out group transform hover:-translate-y-1">
                <div className="relative">
                    <div className="relative h-56 w-full">
                        <Image
                            src={car.images[0]?.url || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'}
                            alt={`${car.make} ${car.model}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/ff0000/ffffff?text=Image+Not+Found'; }}
                        />
                    </div>
                    <div className="absolute top-3 right-3">
                        <button onClick={handleWishlistToggle} className="p-2 rounded-full bg-white/80 dark:bg-gray-900/80 text-red-500 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-xl font-bold text-white">
                            {car.make} {car.model}
                        </h3>
                        <p className="text-sm text-gray-300">{car.year}</p>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                            ${car.price.toLocaleString()}
                        </p>
                        <div className="flex space-x-2">
                            <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">{car.bodyStyle}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                       <p>{car.mileage.toLocaleString()} miles</p>
                       <p>{car.transmission}</p>
                       <p>{car.fuelType}</p>
                    </div>
                    <div className="mt-4">
                         <button onClick={handleCompareClick} className="w-full flex justify-center items-center gap-2 text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <Plus size={16} />
                            Compare
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
