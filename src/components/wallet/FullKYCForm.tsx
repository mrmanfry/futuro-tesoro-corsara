'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  documentType: z.enum(['id_card', 'passport', 'driving_license']),
  documentFile: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'Il file deve essere inferiore a 5MB'
  ),
});

type FormData = z.infer<typeof formSchema>;

interface FullKYCFormProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function FullKYCForm({ onSuccess, onError }: FullKYCFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non autenticato');

      // Converti il file in base64
      const fileReader = new FileReader();
      const fileData = await new Promise<string>((resolve) => {
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.readAsDataURL(data.documentFile);
      });

      // Invia i dati a MangoPay tramite l'API
      const response = await fetch('/api/mangopay/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: data.documentType,
          documentFile: fileData.split(',')[1], // Rimuovi il prefisso base64
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'invio dei documenti');
      }

      toast({
        title: 'Documenti inviati',
        description: 'I tuoi documenti sono stati inviati con successo. Riceverai una notifica quando la verifica sarà completata.',
      });

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Errore durante l\'invio dei dati'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="documentType">Tipo di documento</Label>
          <Select
            onValueChange={(value: 'id_card' | 'passport' | 'driving_license') => 
              form.setValue('documentType', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona il tipo di documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id_card">Carta d'identità</SelectItem>
              <SelectItem value="passport">Passaporto</SelectItem>
              <SelectItem value="driving_license">Patente di guida</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.documentType && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.documentType.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="documentFile">Documento</Label>
          <Input
            id="documentFile"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                form.setValue('documentFile', file);
              }
            }}
          />
          {form.formState.errors.documentFile && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.documentFile.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Invio in corso...' : 'Invia documenti'}
      </Button>
    </form>
  );
} 