'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiPackage } from 'react-icons/fi';
import { SessionData } from '@/lib/session'; // Assuming SessionData is exported from your session lib

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.isLoggedIn) {
            setSession(data);
          } else {
            setSession(null);
          }
        } else {
          setSession(null);
        }
      } catch (error) {
        setSession(null);
      }
    };
    fetchSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      // Optionally, redirect the user to the homepage or login page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <nav className="sticky top-0 z-50 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold tracking-tighter">
              <span className="text-cyan-500">ry</span>
              <span className="text-neutral-800 dark:text-neutral-200">shoes</span>
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-5">


            <Link href="/cart" className="text-neutral-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300 rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 glow-on-hover">
              <FiShoppingCart size={22} />
            </Link>

            <Link href="/orders" className="text-neutral-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300 rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 glow-on-hover">
              <FiPackage size={22} />
            </Link>

            <Link href="/sukai" className="text-neutral-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300 rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 glow-on-hover">
              <FiHeart size={22} />
            </Link>

            {session ? (
              <div className="relative group">
                 <span className="text-neutral-600 dark:text-neutral-300 p-2">
                    Hi, {session.username}
                 </span>
                 <button onClick={handleLogout} className="text-neutral-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300 rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 glow-on-hover">
                    Logout
                 </button>
              </div>
            ) : (
              <Link href="/login" className="text-neutral-600 dark:text-neutral-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300 rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 glow-on-hover">
                <FiUser size={22} />
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
