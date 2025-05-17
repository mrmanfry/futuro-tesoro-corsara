'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/authContext';
import { useEffect, useState, useRef } from 'react';
import { LayoutDashboard } from 'lucide-react';

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  useEffect(() => {
    if (user) {
      fetch('/api/profile/get', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            console.log('Profile fetch failed with status:', res.status);
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.profile) {
            setProfile(data.profile);
          }
        })
        .catch((error) => console.error('Error fetching profile:', error));
    }
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center text-2xl font-bold">
          <span className="text-gray-900">Futuro</span>
          <span className="text-green-500">Tesoro</span>
        </Link>
        {/* Menu */}
        <div className="hidden gap-8 text-base font-medium text-gray-700 md:flex">
          <Link
            href="#come-funziona"
            className="transition hover:text-blue-600"
          >
            Come Funziona
          </Link>
          <Link href="#vantaggi" className="transition hover:text-blue-600">
            Vantaggi
          </Link>
          <Link href="#simulatore" className="transition hover:text-blue-600">
            Simulatore
          </Link>
        </div>
        {/* Pulsante e avatar/menu utente */}
        <div className="flex items-center gap-4">
          {!user && (
            <Link href="/auth/register">
              <button className="rounded-full bg-blue-600 px-6 py-2 text-base font-semibold text-white shadow transition hover:bg-blue-700">
                Accedi
              </button>
            </Link>
          )}
          {user && (
            <div className="relative">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700 focus:outline-none"
                onClick={() => setIsOpen((open) => !open)}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  (profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                )}
              </button>
              {isOpen && (
                <div
                  ref={menuRef}
                  className="absolute right-0 z-50 mt-2 min-w-[180px] rounded-md border bg-white py-2 shadow-lg"
                >
                  <div className="px-4 py-2 text-sm font-medium text-gray-700">
                    {profile?.full_name || user.email}
                  </div>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profilo
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
