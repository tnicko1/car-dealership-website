import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const makes = searchParams.get('make')?.split(',');

    if (!makes) {
        return NextResponse.json({ error: 'Make is required' }, { status: 400 });
    }

    try {
        const models = await prisma.car.findMany({
            where: {
                make: {
                    in: makes,
                },
            },
            select: {
                model: true,
            },
            distinct: ['model'],
        });

        return NextResponse.json(models.map(m => m.model).sort());
    } catch (error) {
        console.error('Failed to fetch models:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
