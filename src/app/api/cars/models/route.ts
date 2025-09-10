import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');

  if (!make) {
    return NextResponse.json({ error: 'Make is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
        const errorDetails = `HTTP error! status: ${response.status}`;
        console.error('Failed to fetch models from NHTSA API:', errorDetails);
        return NextResponse.json({ error: 'Failed to fetch models', details: errorDetails }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to fetch models from NHTSA API:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch models', details: errorMessage }, { status: 500 });
  }
}