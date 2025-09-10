'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabaseAdmin'; // Use the admin client
import { User } from '@prisma/client';

export async function isUsernameAvailable(username: string): Promise<boolean> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return false; // Or handle as an error
    }

    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });

    // If a user is found, the username is available only if it belongs to the current user
    return !user || user.id === session.user.id;
}

export async function completeUserProfile(data: {
    firstName: string;
    lastName: string;
    username: string;
    image?: string;
}): Promise<{ success: boolean; error?: string }> {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    const { firstName, lastName, username, image } = data;
    let imageUrl = image;

    // If the image is a base64 string, upload it to Supabase
    if (image && image.startsWith("data:image/")) {
        const response = await fetch(image);
        const blob = await response.blob();
        const fileName = `${session.user.id}/avatar-${Date.now()}`;
        const { data: uploadData, error } = await supabaseAdmin.storage
            .from("avatars")
            .upload(fileName, blob, {
                cacheControl: "3600",
                upsert: true,
                contentType: blob.type,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return { success: false, error: "Failed to upload image." };
        }

        const { data: { publicUrl } } = supabaseAdmin.storage.from("avatars").getPublicUrl(uploadData.path);
        imageUrl = publicUrl;
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName,
                lastName,
                username,
                ...(imageUrl && { image: imageUrl }),
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update user profile:", error);
        return { success: false, error: "Failed to update profile." };
    }
}

export async function updateUser(formData: FormData): Promise<{ success: boolean; error?: string, user?: User }> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Not authenticated' };
        }
        const userId = session.user.id;

        // User data
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const imageFile = formData.get('image') as File | null;

        // UserProfile data
        const bio = formData.get('bio') as string;
        const website = formData.get('website') as string;
        const x = formData.get('x') as string;
        const github = formData.get('github') as string;
        const linkedin = formData.get('linkedin') as string;

        // Messaging data
        const useSameNumberForApps = formData.get('useSameNumberForApps') === 'on';
        const whatsappEnabled = formData.get('whatsappEnabled') === 'on';
        const whatsappNumber = formData.get('whatsappNumber') as string;
        const viberEnabled = formData.get('viberEnabled') === 'on';
        const viberNumber = formData.get('viberNumber') as string;
        const telegramEnabled = formData.get('telegramEnabled') === 'on';
        const telegramNumber = formData.get('telegramNumber') as string;
        const signalEnabled = formData.get('signalEnabled') === 'on';
        const signalNumber = formData.get('signalNumber') as string;

        let imageUrl: string | undefined = undefined;

        if (imageFile && imageFile.size > 0) {
            const fileName = `${userId}/${Date.now()}-${imageFile.name}`;
            const { data, error } = await supabaseAdmin.storage
                .from('avatars')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (error) {
                console.error('Supabase avatar upload error:', error);
                return { success: false, error: `Upload failed: ${error.message}` };
            }

            const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(data.path);
            imageUrl = publicUrl;
        }

        const [updatedUser] = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: {
                    firstName,
                    lastName,
                    username,
                    email,
                    phone,
                    ...(imageUrl && { image: imageUrl }),
                },
            }),
            prisma.userProfile.upsert({
                where: { userId: userId },
                update: {
                    bio,
                    website,
                    x,
                    github,
                    linkedin,
                    useSameNumberForApps,
                    whatsappEnabled,
                    whatsappNumber,
                    viberEnabled,
                    viberNumber,
                    telegramEnabled,
                    telegramNumber,
                    signalEnabled,
                    signalNumber,
                },
                create: {
                    userId: userId,
                    bio,
                    website,
                    x,
                    github,
                    linkedin,
                    useSameNumberForApps,
                    whatsappEnabled,
                    whatsappNumber,
                    viberEnabled,
                    viberNumber,
                    telegramEnabled,
                    telegramNumber,
                    signalEnabled,
                    signalNumber,
                },
            }),
        ]);

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to update user profile:", error);
        return { success: false, error: (error as Error).message };
    }
}
