import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function ThankYouPage({ params }) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="text-ftb-green h-16 w-16" />
        </div>

        <h1 className="text-3xl font-bold">Grazie per il tuo contributo!</h1>

        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          Il tuo contributo è stato registrato con successo. Hai fatto un passo
          concreto per il futuro di un bambino.
        </p>

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
