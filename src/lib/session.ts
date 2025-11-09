
import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'ryshoes-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export interface SessionData {
  isLoggedIn: boolean;
  id: number;
  username: string;
  role: string;
}

export async function getSession() {
    return getIronSession<SessionData>(await cookies(), sessionOptions);
}
