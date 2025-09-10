'use server';

import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const passwordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Current password is required.' }),
    newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long.' }),
});

const setPasswordSchema = z.object({
    newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long.' }),
});

export async function hasPassword() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return false;
    }
    const account = await prisma.account.findFirst({
        where: { userId: session.user.id, provider: 'credentials' }, // Assuming 'credentials' for password-based accounts
    });
    return !!account?.password;
}

export async function setPassword(values: z.infer<typeof setPasswordSchema>) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
        return { success: false, error: 'User not found.' };
    }

    // Check if the user already has a credentials account
    let account = await prisma.account.findFirst({
        where: { userId: user.id, provider: 'credentials' },
    });

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);

    if (account) {
        // If they for some reason have a credentials account but no password
        await prisma.account.update({
            where: { id: account.id },
            data: { password: hashedPassword },
        });
    } else {
        // Create a new credentials account for the user
        await prisma.account.create({
            data: {
                userId: user.id,
                type: 'credentials',
                provider: 'credentials',
                providerAccountId: user.email!, // Use email as the identifier
                password: hashedPassword,
            }
        });
    }

    revalidatePath('/account');
    return { success: true };
}


export async function changePassword(values: z.infer<typeof passwordSchema>) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
        return { success: false, error: 'User not found.' };
    }

    const account = await prisma.account.findFirst({ where: { userId: user.id, provider: 'credentials' } });
    if (!account || !account.password) {
        return { success: false, error: 'Password not set for this account.' };
    }

    const isPasswordCorrect = await bcrypt.compare(values.currentPassword, account.password);
    if (!isPasswordCorrect) {
        return { success: false, error: 'Incorrect current password.' };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    await prisma.account.update({
        where: { id: account.id },
        data: { password: hashedPassword },
    });

    revalidatePath('/account');

    return { success: true };
}

const notificationSettingsSchema = z.object({
    emailNotifications: z.boolean(),
});

export async function updateNotificationSettings(values: z.infer<typeof notificationSettingsSchema>) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' };
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { emailNotifications: values.emailNotifications },
    });

    revalidatePath('/account');

    return { success: true };
}