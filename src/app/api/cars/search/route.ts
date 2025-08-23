import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const cars = await prisma.car.findMany({
      where: {
        OR: [
          { make: { contains: query, mode: 'insensitive' } },
          { model: { contains: query, mode: 'insensitive' } },
          { bodyStyle: { contains: query, mode: 'insensitive' } },
          { stockNumber: { contains: query, mode: 'insensitive' } },
          // Search by year if the query is a valid number
          isNaN(Number(query)) ? {} : { year: { equals: Number(query) } },
        ],
      },
      take: 5, // Limit the number of results for the autocomplete dropdown
      include: {
        images: {
          take: 1, // Only need one image for the preview
        },
      },
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
