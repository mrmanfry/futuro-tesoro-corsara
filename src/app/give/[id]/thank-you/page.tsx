"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ThankYouPageProps = {
  params: { id: string };
  searchParams: { contributionId?: string };
};

type Contribution = {
  amount: number;
  message?: string;
  payment_status: string;
};

export default function ThankYouPage({ params, searchParams }: ThankYouPageProps) {
  const contributionId = searchParams?.contributionId;
  const [status, setStatus] = useState<string>('loading');
  const [contribution, setContribution] = useState<Contribution | null>(null);

  useEffect(() => {
    if (!contributionId) return;
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/contributions/status?id=${contributionId}`);
        const data = await res.json();
        if (data.success) {
          setContribution(data.contribution);
          setStatus(data.contribution.payment_status);
        } else {
          setStatus('error');
        }
      } catch (e) {
        setStatus('error');
      }
    }
    fetchStatus();
  }, [contributionId]);

  if (!contributionId) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <AlertCircle className="text-red-500 h-16 w-16 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">ID contributo mancante</h1>
        <p>Non è stato possibile determinare lo stato del pagamento.</p>
        <Link href="/" passHref>
          <Button className="mt-6">Torna alla home</Button>
        </Link>
      </div>
    );
  }

  if (status === 'loading' || status === 'pending') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <Loader2 className="animate-spin text-gray-400 h-16 w-16 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">Verifica del pagamento in corso...</h1>
        <p>Stiamo verificando lo stato del tuo pagamento. Attendi qualche istante.</p>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="text-ftb-green h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold">Grazie per il tuo contributo!</h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Il tuo contributo di {contribution ? (contribution.amount / 100).toFixed(2) : ''}€ è stato registrato con successo.
          </p>
          {contribution?.message && (
            <div className="bg-gray-50 rounded p-4 mt-4">
              <p className="font-semibold">Il tuo messaggio:</p>
              <blockquote className="italic">"{contribution.message}"</blockquote>
            </div>
          )}
          <div className="pt-4">
            <Link href={`/give/${params.id}`} passHref>
              <Button variant="outline" className="mr-4">
                Torna alla raccolta
              </Button>
            </Link>
            <Link href="/" passHref>
              <Button>Crea la tua raccolta</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed' || status === 'expired' || status === 'error') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <AlertCircle className="text-red-500 h-16 w-16 mx-auto" />
        <h1 className="text-2xl font-bold mt-4">Pagamento non riuscito</h1>
        <p>Ci dispiace, ma il tuo pagamento non è andato a buon fine. Nessun addebito è stato effettuato.</p>
        <div className="pt-4">
          <Link href={`/give/${params.id}?retry=1`} passHref>
            <Button variant="default" className="mr-4">
              Riprova
            </Button>
          </Link>
          <Link href={`/give/${params.id}`} passHref>
            <Button variant="outline">Torna alla raccolta</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Stato sconosciuto
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
      <AlertCircle className="text-yellow-500 h-16 w-16 mx-auto" />
      <h1 className="text-2xl font-bold mt-4">Stato del pagamento non disponibile</h1>
      <p>Non siamo in grado di determinare lo stato del tuo pagamento in questo momento.</p>
      <div className="pt-4">
        <Link href={`/give/${params.id}`} passHref>
          <Button variant="outline">Torna alla raccolta</Button>
        </Link>
      </div>
    </div>
  );
}
