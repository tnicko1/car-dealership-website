import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    
    // Use .getAll() for fields that can have multiple values
    const make = searchParams.getAll('make');
    const bodyStyle = searchParams.getAll('bodyStyle');
    const fuelType = searchParams.getAll('fuelType');
    const transmission = searchParams.getAll('transmission');

    // Use .get() for single value fields
    const model = searchParams.get('model');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const minMileage = searchParams.get('minMileage');
    const maxMileage = searchParams.get('maxMileage');

    const where: any = {};

    // Handle multi-select filters
    if (make.length > 0) where.make = { in: make };
    if (bodyStyle.length > 0) where.bodyStyle = { in: bodyStyle };
    if (fuelType.length > 0) where.fuelType = { in: fuelType };
    if (transmission.length > 0) where.transmission = { in: transmission };

    // Handle single-value and range filters
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (minPrice) where.price = { ...where.price, gte: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };
    if (minYear) where.year = { ...where.year, gte: Number(minYear) };
    if (maxYear) where.year = { ...where.year, lte: Number(maxYear) };
    if (minMileage) where.mileage = { ...where.mileage, gte: Number(minMileage) };
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
