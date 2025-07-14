import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(cars);
    } catch (error) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
