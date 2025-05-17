"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function TeamStep() {
  const router = useRouter();
  const { state, setTeam } = useCreateGiftContext();
  const [email, setEmail] = useState('');
  const [team, setTeamState] = useState<string[]>(state.team || []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    if (!validateEmail(email)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    if (team.includes(email)) {
      setError('Email già aggiunta.');
      return;
    }
    setTeamState([...team, email]);
    setEmail('');
    setError('');
  };

  const handleRemove = (e: string) => {
    setTeamState(team.filter(t => t !== e));
  };

  const handleBack = () => {
    router.push('/create-gift/preview');
  };

  const handleCreate = async () => {
    setTeam(team);
    setSaving(true);
    // Qui va la logica di autenticazione e salvataggio raccolta (step successivo)
    router.push('/create-gift/submit');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Co-creatori (opzionale)</h2>
      <div className="text-sm text-gray-600 mb-2">
        Puoi invitare altre persone a collaborare alla gestione della raccolta. <br />
        <span className="font-semibold text-blue-700">Solo tu sarai intestatario del wallet e dei fondi.</span>
      </div>
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email co-creatore"
          type="email"
        />
        <Button type="button" onClick={handleAdd} variant="secondary">Aggiungi</Button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex flex-wrap gap-2 mt-2">
        {team.map(e => (
          <span key={e} className="flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
            {e}
            <button type="button" onClick={() => handleRemove(e)} className="ml-1 text-blue-500 hover:text-red-500">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>Indietro</Button>
        <Button onClick={handleCreate} disabled={saving}>
          {saving ? 'Attendi...' : 'Crea raccolta'}
        </Button>
      </div>
    </div>
  );
} 