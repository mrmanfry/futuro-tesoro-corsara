"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ChildDetailsStep() {
  const router = useRouter();
  const { state, setChildDetails } = useCreateGiftContext();
  const [name, setName] = useState(state.childDetails.name);
  const [lastName, setLastName] = useState(state.childDetails.lastName || '');
  const [birthdate, setBirthdate] = useState(state.childDetails.birthdate);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!name.trim() || !lastName.trim() || !birthdate) {
      setError('Compila tutti i campi obbligatori.');
      return;
    }
    setChildDetails({ name, lastName, birthdate });
    router.push('/create-gift/theme');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dettagli del bambino</h2>
      <div>
        <Label>Nome del bambino <span className="text-red-500">*</span></Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      </div>
      <div>
        <Label>Cognome del bambino <span className="text-red-500">*</span></Label>
        <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Cognome" />
      </div>
      <div>
        <Label>Data di nascita <span className="text-red-500">*</span></Label>
        <Input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end">
        <Button onClick={handleNext}>Avanti</Button>
      </div>
    </div>
  );
} 