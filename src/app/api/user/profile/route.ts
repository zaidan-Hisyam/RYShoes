import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { name: true, alamat_lengkap: true, username: true }, // Select relevant profile fields
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Map to UserProfile interface expected by ConfirmBuyPage
    const userProfile = {
      name: user.name || user.username, // Use name if available, otherwise username
      address: user.alamat_lengkap || '',
      phone: '', // Assuming phone is not in User model yet, or needs to be fetched separately
    };

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
