
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, SessionData } from '@/lib/session';

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    // Since we can't use server-side getSession in a client component,
    // we can create an API route to fetch session data.
    const fetchSession = async () => {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        const data = await res.json();
        if (data.isLoggedIn && data.role === 'ADMIN') {
          setSession(data);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };
    fetchSession();
  }, [router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome, {session.username}!</p>
      {/* Add your CRUD components here */}
    </div>
  );
}
