'use client';

import Link from 'next/link';
import { useAuth } from '../../lib/authContext';
import { useTest } from '../../lib/test-hook';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [test] = useTest();

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
        {/* Pulsante e avatar */}
        <div className="flex items-center gap-4">
          <Link href="/auth/register">
            <button className="rounded-full bg-blue-600 px-6 py-2 text-base font-semibold text-white shadow transition hover:bg-blue-700">
              Crea Regalo
            </button>
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
            PE
          </div>
        </div>
      </div>
    </nav>
  );
}
