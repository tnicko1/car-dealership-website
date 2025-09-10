'use server';

import prisma from "@/lib/prisma";
import { Twilio } from 'twilio';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { revalidatePath } from 'next/cache';

const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const phoneSchema = z.string().min(10, { message: 'Phone number is required.' });

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationCode(phone: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' };
    }

    const parsedPhone = phoneSchema.safeParse(phone);
    if (!parsedPhone.success) {
        return { success: false, error: 'Invalid phone number.' };
    }

    try {
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await prisma.verification.deleteMany({ where: { phone } });
        await prisma.verification.create({
            data: { phone, code, expiresAt },
        });

        await twilioClient.messages.create({
            body: `Your verification code is: ${code}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        return { success: true };
    } catch (error) {
        console.error('Error sending verification code:', error);
        return { success: false, error: 'Failed to send verification code.' };
    }
}

export async function verifyCode(phone: string, code: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const verification = await prisma.verification.findUnique({
            where: { phone_code: { phone, code } },
        });

        if (!verification || verification.expiresAt < new Date()) {
            return { success: false, error: 'Invalid or expired code.' };
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { phone, phoneVerified: true },
        });

        await prisma.verification.delete({ where: { id: verification.id } });
        
        revalidatePath('/account');

        return { success: true };
    } catch (error) {
        console.error('Error verifying code:', error);
        return { success: false, error: 'Failed to verify code.' };
    }
}
