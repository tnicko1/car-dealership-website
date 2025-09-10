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

        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const imageFile = formData.get('image') as File | null;

        let imageUrl: string | undefined = undefined;

        if (imageFile && imageFile.size > 0) {
            // Re-add the user ID to the path for organization and to work with RLS policies
            const fileName = `${session.user.id}/${Date.now()}-${imageFile.name}`;
            const { data, error } = await supabaseAdmin.storage
                .from('avatars')
                .upload(fileName, imageFile, {
                    cacheControl: '36-00',
                    upsert: true,
                });

            if (error) {
                console.error('Supabase avatar upload error:', error);
                return { success: false, error: `Upload failed: ${error.message}` };
            }

            const { data: { publicUrl } } = supabaseAdmin.storage.from('avatars').getPublicUrl(data.path);
            imageUrl = publicUrl;
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                firstName,
                lastName,
                username,
                email,
                phone,
                ...(imageUrl && { image: imageUrl }),
            },
        });
        return { success: true, user: updatedUser };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
