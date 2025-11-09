
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const session = await getSession();
    session.destroy();
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
