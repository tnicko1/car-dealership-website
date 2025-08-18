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

    if (imageFile && imageFile.size > 0) {
        const fileName = `${session.user.id}-${Date.now()}`;
        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, imageFile, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            return { success: false, error: 'Failed to upload image.' };
        }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
        imageUrl = publicUrl;
    }

    try {
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
        return { success: false, error: 'Failed to update user.' };
    }
}
