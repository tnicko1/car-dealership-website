'use client'
import {useEffect,useState} from "react";
import {CarWithImages} from "@/types/car";
import {getCar} from "@/actions/carActions";
import AdminForm from "@/components/AdminForm";

export default function EditFormWrapper({id}: { id: string }) {
    const [car, setCar] = useState<CarWithImages | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true);
                const carData = await getCar(id);
                if (!carData) {
                    setError("Car not found");
                } else {
                    setCar(carData);
                }
            } catch (e) {
                setError("Failed to fetch car data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!car) {
        return <div className="text-center">Car not found.</div>;
    }

    return <AdminForm car={car}/>;
}