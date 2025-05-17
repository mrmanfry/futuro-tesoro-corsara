'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

type KYCStatus = 'required' | 'pending' | 'verified';

interface KYCStatusProps {
  status: KYCStatus;
  className?: string;
}

export function KYCStatus({ status, className = "" }: KYCStatusProps) {
  const router = useRouter();

  const statusConfig = {
    required: {
      icon: AlertCircle,
      title: 'Verifica Identità Richiesta',
      description: 'Per continuare a utilizzare la piattaforma, completa la verifica della tua identità.',
      buttonText: 'Completa Verifica',
      variant: 'destructive' as const,
    },
    pending: {
      icon: Clock,
      title: 'Verifica in Corso',
      description: 'La tua verifica identità è in fase di elaborazione. Ti notificheremo appena completata.',
      buttonText: 'Visualizza Stato',
      variant: 'default' as const,
    },
    verified: {
      icon: CheckCircle2,
      title: 'Verifica Completata',
      description: 'La tua verifica identità è stata completata con successo.',
      buttonText: 'Visualizza Dettagli',
      variant: 'default' as const,
    },
  };

  const config = statusConfig[status];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <config.icon className="h-5 w-5" />
          <CardTitle>{config.title}</CardTitle>
        </div>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={config.variant}
          className="w-full sm:w-auto"
          onClick={() => router.push('/wallet/kyc')}
        >
          {config.buttonText}
        </Button>
      </CardContent>
    </Card>
  );
} 