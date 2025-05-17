"use client";
import { AuthForm } from '@/components/auth/AuthForm';
// import Navbar from '@/components/layout/Navbar';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (from === 'create-gift-preview') {
        router.replace('/create-gift/preview');
      } else if (from === 'create-gift') {
        router.replace('/create-gift');
      }
    }
  }, [user, loading, from, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Accedi al tuo account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Oppure{' '}
            <a
              href={from ? `/auth/register?from=${from}` : '/auth/register'}
              className="font-medium text-ftb-blue-600 hover:text-ftb-blue-500"
            >
              registrati per un nuovo account
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <AuthForm mode="sign-in" />
          </div>
        </div>
      </div>
    </div>
  );
}
