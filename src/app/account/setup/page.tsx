import SetupForm from "@/components/SetupForm";
import { Suspense } from "react";

const SetupPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Complete Your Profile</h1>
                <p className="text-center text-gray-600">
                    Please fill out the information below to continue.
                </p>
                <Suspense fallback={<div>Loading...</div>}>
                    <SetupForm />
                </Suspense>
            </div>
        </div>
    );
};

export default SetupPage;
