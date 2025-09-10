"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/actions/userProfileActions";
import Image from "next/image";

const SetupForm = () => {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        image: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            setFormData({
                firstName: session.user.firstName || "",
                lastName: session.user.lastName || "",
                username: session.user.username || "",
                image: session.user.image || "",
            });
        }
    }, [session, status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.firstName || !formData.lastName || !formData.username || !formData.image) {
            setError("All fields are required.");
            return;
        }

        try {
            const result = await updateUserProfile(formData);
            if (result.success) {
                await update(); // This will trigger a session update
                router.push("/account");
            } else {
                setError(result.error || "An unknown error occurred.");
            }
        } catch (err) {
            setError("Failed to update profile.");
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                </label>
                <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                </label>
                <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                    Profile Picture
                </label>
                <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
                {formData.image && (
                    <Image src={formData.image} alt="Profile Preview" width={96} height={96} className="mt-4 w-24 h-24 rounded-full object-cover" />
                )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Save and Continue
            </button>
        </form>
    );
};

export default SetupForm;
