'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { User } from '@prisma/client';

export async function updateUser(formData: FormData): Promise<{ success: boolean; error?: string, user?: User }> {
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

    try {
        if (imageFile && imageFile.size > 0) {
            // The policy requires the path to be prefixed with the user's ID.
            const fileName = `${session.user.id}/${Date.now()}-${imageFile.name}`;
            const { data, error } = await supabase.storage
                .from('avatars')
                .upload(fileName, imageFile, {
                    cacheControl: '3600',
                    upsert: true, // Allow overwriting to update the avatar
                });

            if (error) {
                console.error('Supabase avatar upload error:', error);
                return { success: false, error: 'Failed to upload image.' };
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
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
                // Only update the image if a new one was uploaded
                ...(imageUrl && { image: imageUrl }),
            },
        });
        return { success: true, user: updatedUser };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}
