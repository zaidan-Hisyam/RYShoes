
import { PrismaClient } from '@/generated/prisma';
import { compare } from 'bcrypt';
import { NextResponse } from 'next/server';
import { getSession, SessionData } from '@/lib/session';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }

    const session = await getSession();
    session.isLoggedIn = true;
    session.id = user.id;
    session.username = user.username;
    session.role = user.role;
    await session.save();

    return NextResponse.json({ message: 'Logged in successfully', role: user.role }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
