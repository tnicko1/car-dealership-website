
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import jwt from 'jsonwebtoken';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET is not defined in environment variables');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  const token = jwt.sign({ userId: session.user.id }, process.env.NEXTAUTH_SECRET, {
    expiresIn: '60s', // The token is short-lived
  });

  return NextResponse.json({ token });
}
