'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { GiftCollection, BankProfile } from '@/types/database';

interface TransferFundsFormProps {
  collection: GiftCollection;
  bankProfile: BankProfile;
  totalAmount: number;
}

export function TransferFundsForm({
  collection,
  bankProfile,
  totalAmount,
}: TransferFundsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleTransfer = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/investment/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: collection.id,
          bankProfileId: bankProfile.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || 'Si è verificato un errore durante il trasferimento'
        );
      }

      toast({
        title: 'Trasferimento avviato',
        description: `Il trasferimento di €${totalAmount.toFixed(2)} è stato avviato con successo.`,
      });

      // Reindirizza alla dashboard
      router.push('/collections');
      router.refresh();
    } catch (error) {
      console.error('Errore:', error);
      toast({
        title: 'Errore',
        description:
          error.message ||
          'Non è stato possibile completare il trasferimento. Riprova più tardi.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trasferisci i fondi</CardTitle>
        <CardDescription>
          Trasferisci i fondi raccolti al tuo account Moneyfarm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <div className="mb-2 flex justify-between">
            <span className="text-sm">Totale raccolto:</span>
            <span className="font-semibold">€{totalAmount.toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span className="text-sm">Account di destinazione:</span>
            <span className="font-semibold">
              {bankProfile.holder_full_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Riferimento:</span>
            <span className="font-medium">
              Collection-{collection.id.substring(0, 8)}
            </span>
          </div>
        </div>

        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attenzione</AlertTitle>
          <AlertDescription>
            Una volta trasferiti, i fondi non potranno essere restituiti. Il
            trasferimento sarà completato entro 1-2 giorni lavorativi.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          className="w-full"
          disabled={isSubmitting || totalAmount <= 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Trasferimento in corso...
            </>
          ) : (
            <>
              Trasferisci €{totalAmount.toFixed(2)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
