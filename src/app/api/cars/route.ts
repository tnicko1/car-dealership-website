import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bodyStyle = searchParams.get('bodyStyle');
    const fuelType = searchParams.get('fuelType');
    const transmission = searchParams.get('transmission');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const maxMileage = searchParams.get('maxMileage');

    const where: any = {};

    if (make) where.make = make;
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (minPrice) where.price = { ...where.price, gte: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };
    if (bodyStyle) where.bodyStyle = bodyStyle;
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;
    if (minYear) where.year = { ...where.year, gte: Number(minYear) };
    if (maxYear) where.year = { ...where.year, lte: Number(maxYear) };
    if (maxMileage) where.mileage = { ...where.mileage, lte: Number(maxMileage) };

    try {
        const cars = await prisma.car.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { images: true },
        });
        return NextResponse.json(cars);
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}