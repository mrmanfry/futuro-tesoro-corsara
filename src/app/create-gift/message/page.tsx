"use client";
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function MessageStep() {
  const { state, setMessage } = useCreateGiftContext();
  const [message, setMessageState] = useState(state.message || '');

  const handleNext = () => {
    setMessage(message);
    // La navigazione al prossimo step è gestita dal wizard principale
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Messaggio per i partecipanti</h2>
      <Input
        value={message}
        onChange={e => setMessageState(e.target.value)}
        placeholder="Scrivi un messaggio per chi parteciperà alla raccolta..."
        className="h-20"
      />
      <div className="flex justify-end">
        <Button onClick={handleNext}>Avanti</Button>
      </div>
    </div>
  );
} 