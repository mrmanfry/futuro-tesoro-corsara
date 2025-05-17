"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

const THEMES = [
  { type: 'università', label: 'Università', icon: '🎓', color: 'bg-blue-100' },
  { type: 'macchina', label: 'Prima macchina', icon: '🚗', color: 'bg-yellow-100' },
  { type: 'viaggio', label: 'Primo viaggio', icon: '✈️', color: 'bg-green-100' },
  { type: 'casa', label: 'Prima casa', icon: '🏠', color: 'bg-pink-100' },
  { type: 'sport', label: 'Sport', icon: '⚽', color: 'bg-orange-100' },
  { type: 'altro', label: 'Altro (personalizzato)', icon: '✨', color: 'bg-gray-100' },
];

function getDefaultMessage(theme: string, name: string) {
  if (!theme || !name) return '';
  return `Per ${theme} di ${name} abbiamo deciso di porre tutti insieme un piccolo mattone per la vita futura di ${name}`;
}

export default function ThemeStep() {
  const router = useRouter();
  const { state, setTheme, setMessage, setPhoto } = useCreateGiftContext();
  const [selected, setSelected] = useState(state.theme.type || '');
  const [custom, setCustom] = useState(state.theme.custom || '');
  const [message, setMsg] = useState(state.message || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Aggiorna messaggio predefinito quando cambia tema o nome
    const themeLabel = selected === 'altro' ? custom : THEMES.find(t => t.type === selected)?.label || '';
    if (themeLabel && state.childDetails.name) {
      setMsg(getDefaultMessage(themeLabel, state.childDetails.name));
    }
  }, [selected, custom, state.childDetails.name]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleNext = () => {
    const themeLabel = selected === 'altro' ? custom : THEMES.find(t => t.type === selected)?.label || '';
    if (!selected || (selected === 'altro' && !custom.trim())) {
      setError('Scegli o inserisci un tema.');
      return;
    }
    setTheme({
      type: selected,
      custom,
      icon: THEMES.find(t => t.type === selected)?.icon || '✨',
      color: THEMES.find(t => t.type === selected)?.color || 'bg-gray-100',
    });
    setMessage(message);
    router.push('/create-gift/preview');
  };

  const handleBack = () => {
    router.push('/create-gift/child-details');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Tema della raccolta</h2>
      {/* Caricamento foto raccolta */}
      <div className="flex flex-col items-center mb-4">
        <label
          htmlFor="photo-upload"
          className="w-full cursor-pointer flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition group"
        >
          {state.photo ? (
            <img src={state.photo} alt="Anteprima" className="object-cover w-full h-48 rounded-lg" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <UploadCloud className="w-12 h-12 text-gray-400 mb-2 group-hover:text-blue-500" />
              <span className="text-gray-500 group-hover:text-blue-600">Carica una foto</span>
              <span className="text-xs text-gray-400">(PNG, JPG, max 5MB)</span>
            </div>
          )}
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {state.photo && (
          <button
            type="button"
            className="mt-2 text-sm text-blue-600 hover:underline"
            onClick={() => { setPhoto(''); if (fileInputRef.current) (fileInputRef.current as HTMLInputElement).value = ''; }}
          >
            Cambia foto
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {THEMES.map((t) => (
          <button
            key={t.type}
            type="button"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 border transition ${selected === t.type ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} ${t.color}`}
            onClick={() => setSelected(t.type)}
          >
            <span className="text-xl">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {selected === 'altro' && (
        <div>
          <Label>Tema personalizzato</Label>
          <Input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Es: Laurea, Cresima, ecc." />
        </div>
      )}
      <div>
        <Label>Messaggio per la raccolta</Label>
        <Input
          value={message}
          onChange={e => setMsg(e.target.value)}
          className="h-20"
        />
        <div className="text-xs text-gray-500 mt-1">Puoi personalizzare il messaggio per i donatori.</div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>Indietro</Button>
        <Button onClick={handleNext}>Avanti</Button>
      </div>
    </div>
  );
} 