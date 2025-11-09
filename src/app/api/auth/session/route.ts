
import { getSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    if (session.isLoggedIn) {
      return NextResponse.json(session, { status: 200 });
    } else {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
