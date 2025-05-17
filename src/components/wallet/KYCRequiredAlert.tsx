'use client';

import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface KYCRequiredAlertProps {
  message?: string;
  className?: string;
}

export function KYCRequiredAlert({ 
  message = "Per continuare, è necessario completare la verifica della tua identità.",
  className = ""
}: KYCRequiredAlertProps) {
  const router = useRouter();

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Verifica Identità Richiesta</AlertTitle>
      <AlertDescription className="flex flex-col space-y-4">
        <p>{message}</p>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push('/wallet/kyc')}
        >
          Completa Verifica
        </Button>
      </AlertDescription>
    </Alert>
  );
} 