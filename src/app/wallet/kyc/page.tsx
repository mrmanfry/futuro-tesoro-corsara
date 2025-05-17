'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FullKYCForm } from '@/components/wallet/FullKYCForm';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LightKYCForm } from "@/components/wallet/LightKYCForm";

export default function KYCPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/mangopay/kyc");
        const data = await res.json();
        setKycStatus(data.status);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96">Caricamento...</div>;
  }

  if (kycStatus === 'verified') {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Verifica Identità Completata</CardTitle>
            <CardDescription>
              La tua verifica identità è stata completata con successo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTitle>Stato: Verificato</AlertTitle>
              <AlertDescription>
                Puoi continuare a utilizzare la piattaforma normalmente.
              </AlertDescription>
            </Alert>
            <Button 
              className="mt-4"
              onClick={() => router.push('/dashboard')}
            >
              Torna alla Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Completa la Verifica Identità</CardTitle>
          <CardDescription>
            Per continuare a utilizzare la piattaforma, è necessario completare la verifica della tua identità.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {kycStatus === "light_required" ? (
            <LightKYCForm onSuccess={() => window.location.reload()} onError={() => {}} />
          ) : (
            <FullKYCForm onSuccess={() => window.location.reload()} onError={() => {}} />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 