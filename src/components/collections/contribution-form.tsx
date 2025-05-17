'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const contributionSchema = z.object({
  amount: z.number().min(1, "L'importo deve essere maggiore di 0"),
  donorName: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  message: z.string().optional(),
  isPublic: z.boolean().default(true),
  donorRelation: z.string().optional(),
});

type ContributionFormData = z.infer<typeof contributionSchema>;

interface ContributionFormProps {
  collectionId: string;
  onSuccess?: () => void;
}

export function ContributionForm({ collectionId, onSuccess }: ContributionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const onSubmit = async (data: ContributionFormData) => {
    if (!collectionId || collectionId === 'undefined') {
      toast.error('Errore', {
        description: 'ID raccolta mancante. Riprova dalla pagina corretta.',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/collections/${collectionId}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore durante la contribuzione');
      }

      toast.success('Contribuzione creata con successo!', {
        description: 'Reindirizzamento alla pagina di pagamento...',
      });

      // Redirect to MangoPay payment page
      if (result.payment?.redirectUrl) {
        window.location.href = result.payment.redirectUrl;
      } else {
        throw new Error('URL di pagamento non disponibile');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore', {
        description:
          error instanceof Error
            ? error.message
            : 'Non è stato possibile creare la contribuzione. Riprova più tardi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Importo (€)</Label>
              <Input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          className={errors.amount ? 'border-red-500' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
          </div>

      <div className="space-y-2">
        <Label htmlFor="donorName">Il tuo nome</Label>
              <Input
                id="donorName"
          {...register('donorName')}
          className={errors.donorName ? 'border-red-500' : ''}
        />
        {errors.donorName && (
          <p className="text-sm text-red-500">{errors.donorName.message}</p>
        )}
            </div>

      <div className="space-y-2">
        <Label htmlFor="donorRelation">Relazione con il bambino</Label>
              <Input
                id="donorRelation"
          {...register('donorRelation')}
          placeholder="Es. Zio, Amico di famiglia, etc."
              />
            </div>

      <div className="space-y-2">
        <Label htmlFor="message">Messaggio (opzionale)</Label>
              <Textarea
                id="message"
          {...register('message')}
          placeholder="Scrivi un messaggio per il bambino..."
              />
            </div>

      <div className="space-y-2">
        <Label>Visibilità</Label>
        <RadioGroup
          defaultValue="public"
          onValueChange={(value) => {
            const isPublic = value === 'public';
            register('isPublic').onChange({ target: { value: isPublic } });
          }}
        >
            <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Pubblica</Label>
            </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Privata</Label>
          </div>
        </RadioGroup>
          </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Elaborazione...' : 'Contribuisci'}
          </Button>
        </form>
  );
}
