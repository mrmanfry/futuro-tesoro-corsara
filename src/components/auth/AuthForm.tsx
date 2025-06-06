'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

const authSchema = z.object({
  email: z.string().email('Inserisci un indirizzo email valido'),
  password: z.string().min(6, 'La password deve essere di almeno 6 caratteri'),
});

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: from
          ? `${window.location.origin}/auth/login?from=${from}`
          : `${window.location.origin}/`,
      },
    });
    setGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const validatedData = authSchema.parse({ email, password });

      if (mode === 'sign-up') {
        const signupOptions: any = {};
        if (from) {
          signupOptions.emailRedirectTo = `${window.location.origin}/auth/login?from=${from}`;
        }
        const { error: signUpError } = await supabase.auth.signUp({
          email: validatedData.email,
          password: validatedData.password,
          options: signupOptions,
        });

        if (signUpError) throw signUpError;
        router.push('/auth/verify-email');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: validatedData.email,
          password: validatedData.password,
        });

        if (signInError) throw signInError;
        if (from === 'create-gift') {
          router.push('/create-gift');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Si è verificato un errore. Riprova più tardi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ftb-blue-500 focus:ring-offset-2 disabled:opacity-60"
        aria-label={mode === 'sign-in' ? 'Accedi con Google' : 'Registrati con Google'}
      >
        <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
        {googleLoading
          ? 'Attendi...'
          : mode === 'sign-in'
            ? 'Accedi con Google'
            : 'Registrati con Google'}
      </button>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-2 text-gray-400 text-xs">oppure</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-ftb-blue-500 focus:outline-none focus:ring-ftb-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={
              mode === 'sign-up' ? 'new-password' : 'current-password'
            }
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-ftb-blue-500 focus:outline-none focus:ring-ftb-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full justify-center rounded-md border border-transparent bg-ftb-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ftb-blue-700 focus:outline-none focus:ring-2 focus:ring-ftb-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Caricamento...'
            : mode === 'sign-up'
              ? 'Registrati'
              : 'Accedi'}
        </button>
      </div>
    </form>
  );
}
