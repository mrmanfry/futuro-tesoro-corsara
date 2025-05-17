"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ChildProfile } from '@/types/database';
import { PlusCircle } from 'lucide-react';

export default function ChildDetailsStep() {
  const router = useRouter();
  const { state, setChildDetails } = useCreateGiftContext();
  const [name, setName] = useState(state.childDetails.name);
  const [birthdate, setBirthdate] = useState(state.childDetails.birthdate);
  const [error, setError] = useState('');
  const [existingChildren, setExistingChildren] = useState<ChildProfile[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [lastName, setLastName] = useState('');

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchChildren() {
      try {
        const { data: children, error } = await supabase
          .from('child_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setExistingChildren(children || []);
        // Se non ci sono bambini, mostra direttamente il form per crearne uno
        if (!children?.length) {
          setIsAddingNew(true);
        }
      } catch (err) {
        console.error('Errore nel recupero dei bambini:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChildren();
  }, [supabase]);

  const handleNext = async () => {
    if (selectedChildId) {
      // Se è stato selezionato un bambino esistente
      const selectedChild = existingChildren.find(c => c.id === selectedChildId);
      if (selectedChild) {
        setChildDetails({
          name: selectedChild.first_name,
          lastName: selectedChild.last_name,
          birthdate: typeof selectedChild.birthdate === 'string'
            ? selectedChild.birthdate
            : selectedChild.birthdate.toISOString().split('T')[0],
          childProfileId: selectedChild.id
        });
        router.push('/create-gift/theme');
      }
    } else {
      // Se si sta creando un nuovo bambino
      if (!name.trim() || !lastName.trim() || !birthdate) {
        setError('Compila tutti i campi obbligatori.');
        return;
      }

      // Verifica autenticazione
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        // Utente non autenticato: salva solo in locale e vai avanti
        setChildDetails({
          name,
          lastName,
          birthdate,
          childProfileId: ''
        });
        router.push('/create-gift/theme');
        return;
      }

      // Controllo duplicati
      const { data: duplicate, error: dupError } = await supabase
        .from('child_profiles')
        .select('id')
        .eq('first_name', name)
        .eq('last_name', lastName)
        .eq('birthdate', new Date(birthdate).toISOString())
        .maybeSingle();
      if (dupError) {
        setError('Errore durante il controllo duplicati.');
        return;
      }
      if (duplicate) {
        setError('Questo bambino è già presente nel database.');
        return;
      }

      try {
        // Crea il nuovo profilo bambino SOLO se autenticato
        const { data: newChild, error } = await supabase
          .from('child_profiles')
          .insert({
            first_name: name,
            last_name: lastName,
            birthdate: new Date(birthdate),
            user_id: userData.user.id
          })
          .select()
          .single();

        if (error) throw error;

        setChildDetails({
          name,
          lastName,
          birthdate,
          childProfileId: newChild.id
        });
        router.push('/create-gift/theme');
      } catch (err) {
        console.error('Errore nella creazione del profilo bambino:', err);
        setError('Si è verificato un errore. Riprova più tardi.');
      }
    }
  };

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dettagli del bambino</h2>
      
      {!isAddingNew && existingChildren.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Seleziona un bambino esistente</Label>
            <RadioGroup
              value={selectedChildId || ''}
              onValueChange={(value) => {
                setSelectedChildId(value);
                setName('');
                setBirthdate('');
              }}
            >
              {existingChildren.map((child) => (
                <div key={child.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={child.id} id={child.id} />
                  <Label htmlFor={child.id}>
                    {child.first_name} - Nato il {new Date(child.birthdate).toLocaleDateString()}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNew(true);
                setSelectedChildId(null);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi nuovo bambino
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!selectedChildId}
            >
              Avanti
            </Button>
          </div>
        </div>
      )}

      {isAddingNew && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Nome del bambino <span className="text-red-500">*</span></Label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Nome" 
              />
            </div>
            <div>
              <Label>Cognome del bambino <span className="text-red-500">*</span></Label>
              <Input 
                value={lastName} 
                onChange={e => setLastName(e.target.value)} 
                placeholder="Cognome" 
              />
            </div>
            <div>
              <Label>Data di nascita <span className="text-red-500">*</span></Label>
              <Input 
                type="date" 
                value={birthdate} 
                onChange={e => setBirthdate(e.target.value)} 
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <div className="flex items-center justify-between pt-4 border-t">
            {existingChildren.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setName('');
                  setBirthdate('');
                }}
              >
                Torna alla selezione
              </Button>
            )}
            <Button onClick={handleNext}>
              Avanti
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
