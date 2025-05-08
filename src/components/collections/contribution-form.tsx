'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Heart, CreditCard } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { GiftCollection } from '@/types/database';

interface ContributionFormProps {
  collection: GiftCollection;
}

const SUGGESTED_AMOUNTS = [20, 50, 100, 200, 500];

export function ContributionForm({ collection }: ContributionFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorRelation, setDonorRelation] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountSelect = (value: string) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setAmount('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donorName || !donorEmail || (!amount && !customAmount)) {
      toast.error('Per favore compila tutti i campi obbligatori');
      return;
    }

    try {
      setIsLoading(true);

      // 1. Crea la sessione di pagamento con MangoPay
      const { data: session, error: sessionError } =
        await supabase.functions.invoke('create-payment-session', {
          body: {
            collectionId: collection.id,
            amount: customAmount || amount,
            donorName,
            donorEmail,
            donorRelation,
            message,
            isPublic,
          },
        });

      if (sessionError) {
        throw sessionError;
      }

      // 2. Reindirizza alla pagina di pagamento
      router.push(session.url);
    } catch (err) {
      console.error('Errore durante la creazione del contributo:', err);
      toast.error('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribuisci</CardTitle>
        <CardDescription>
          Scegli l'importo e compila i tuoi dati
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Importo</Label>
            <RadioGroup
              value={amount}
              onValueChange={handleAmountSelect}
              className="grid grid-cols-3 gap-2"
            >
              {SUGGESTED_AMOUNTS.map((suggestedAmount) => (
                <div key={suggestedAmount}>
                  <RadioGroupItem
                    value={suggestedAmount.toString()}
                    id={`amount-${suggestedAmount}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`amount-${suggestedAmount}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Heart className="mb-2 h-4 w-4" />€{suggestedAmount}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="relative">
              <Input
                type="text"
                placeholder="Altro importo"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                €
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="donorName">Nome *</Label>
              <Input
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Il tuo nome"
                required
              />
            </div>

            <div>
              <Label htmlFor="donorEmail">Email *</Label>
              <Input
                id="donorEmail"
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="La tua email"
                required
              />
            </div>

            <div>
              <Label htmlFor="donorRelation">Rapporto con il bambino</Label>
              <Input
                id="donorRelation"
                value={donorRelation}
                onChange={(e) => setDonorRelation(e.target.value)}
                placeholder="es. Zio, Amico di famiglia, ecc."
              />
            </div>

            <div>
              <Label htmlFor="message">Messaggio</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Un messaggio per il bambino..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPublic" className="text-sm">
                Mostra il mio nome pubblicamente
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {isLoading ? 'Elaborazione...' : 'Procedi al pagamento'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
