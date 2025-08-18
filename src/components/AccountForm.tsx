'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { updateUser } from '@/actions/userActions';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function AccountForm({ user }: { user: User }) {
    const { data: session, update } = useSession();
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(user.image || '');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('phone', phone);
        if (image) {
            formData.append('image', image);
        }

        const result = await updateUser(formData);
        if (result.success) {
            setMessage('Profile updated successfully!');
            setMessageType('success');
            // Trigger session update
            await update({
                ...session,
                user: {
                    ...session?.user,
                    name: result.user?.username,
                    email: result.user?.email,
                    image: result.user?.image,
                },
            });
        } else {
            setMessage(result.error || 'An error occurred.');
            setMessageType('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            {message && (
                <p className={messageType === 'success' ? 'text-green-500' : 'text-red-500'}>
                    {message}
                </p>
            )}
            <div className="flex items-center gap-6">
                <Image src={preview} alt="Profile preview" width={80} height={80} className="rounded-full" />
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Profile Picture
                    </label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                </label>
                <PhoneInput
                    id="phone"
                    value={phone}
                    onChange={(value) => setPhone(value || '')}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
