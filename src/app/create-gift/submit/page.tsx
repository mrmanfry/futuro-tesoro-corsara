"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/authContext';

export default function SubmitStep() {
  const router = useRouter();
  const { state, reset } = useCreateGiftContext();
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setStatus('saving');
    setError('');
    try {
      // Salva raccolta su Supabase
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childDetails: {
            name: state.childDetails.name,
            birthdate: state.childDetails.birthdate,
            childProfileId: state.childDetails.childProfileId
          },
          theme: state.theme,
          message: state.message,
          team: state.team,
        }),
      });
      if (!res.ok) throw new Error('Errore nel salvataggio della raccolta');
      setStatus('success');
      reset();
      setTimeout(() => router.replace('/dashboard'), 2000);
    } catch (e: any) {
      setStatus('error');
      setError(e.message || 'Errore sconosciuto');
    }
  };

  if (!user) {
    useEffect(() => {
      window.location.href = '/auth/login?from=create-gift-preview';
    }, []);
    return <div className="text-center py-12">Devi accedere per pubblicare la raccolta. Reindirizzamento al login...</div>;
  }

  const imageUrl = state.photo || (state.theme.type === 'università' ? '/stock/universita.jpg' : '/stock/default.jpg');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Conferma e pubblica</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img src={imageUrl} alt="Foto raccolta" className="object-cover w-full h-full" />
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded ${state.theme.color || 'bg-gray-100'}`}> 
          <span className="text-2xl">{state.theme.icon}</span>
          <span className="font-semibold text-lg">{state.theme.type === 'altro' ? state.theme.custom : state.theme.type}</span>
        </div>
        <div className="text-xl font-bold">{state.childDetails.name} {state.childDetails.lastName}</div>
        <div className="text-gray-500">Nato il {state.childDetails.birthdate}</div>
        <div className="text-base mt-2 text-center">{state.message?.trim() ? state.message : `Per ${(state.theme.type === 'altro' ? state.theme.custom : state.theme.type)} di ${state.childDetails.name} ${state.childDetails.lastName} abbiamo deciso di porre tutti insieme un piccolo mattone per la vita futura di ${state.childDetails.name} ${state.childDetails.lastName}`}</div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={status === 'saving' || status === 'success'}
        >
          {status === 'saving' ? 'Salvataggio...' : status === 'success' ? 'Pubblicato!' : 'Pubblica raccolta'}
        </Button>
      </div>
    </div>
  );
} 