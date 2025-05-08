'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ChildProfile } from '@/types/database';

// Schema di validazione
const accountFormSchema = z.object({
  holderFullName: z
    .string()
    .min(2, 'Il nome completo deve contenere almeno 2 caratteri'),
  holderEmail: z.string().email('Inserisci un indirizzo email valido'),
  holderBirthdate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    return !isNaN(parsedDate.getTime()) && parsedDate <= eighteenYearsAgo;
  }, 'Devi avere almeno 18 anni'),
  holderTaxcode: z.string().optional(),
});

interface AccountCreationFormProps {
  childProfile: ChildProfile;
  onSuccess: (accountId: string, kycUrl: string) => void;
}

export function AccountCreationForm({
  childProfile,
  onSuccess,
}: AccountCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      holderFullName: '',
      holderEmail: '',
      holderBirthdate: '',
      holderTaxcode: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof accountFormSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/investment/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: childProfile.id,
          ...data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Si è verificato un errore durante la creazione dell'account"
        );
      }

      toast({
        title: 'Account creato con successo',
        description:
          "L'account Moneyfarm è stato creato. Completa la verifica KYC per procedere.",
      });

      onSuccess(result.account.accountId, result.account.kycUrl);
    } catch (error) {
      console.error('Errore:', error);
      toast({
        title: 'Errore',
        description:
          error.message ||
          "Non è stato possibile creare l'account. Riprova più tardi.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea Account Moneyfarm</CardTitle>
        <CardDescription>
          Inserisci i dati del titolare dell'account per iniziare il processo di
          investimento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="holderFullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Mario Rossi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holderEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mario.rossi@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holderBirthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data di nascita</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="holderTaxcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codice fiscale (opzionale)</FormLabel>
                  <FormControl>
                    <Input placeholder="RSSMRA80A01H501T" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creazione in corso...
                </>
              ) : (
                'Crea Account'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        I tuoi dati saranno condivisi con Moneyfarm per la creazione
        dell'account
      </CardFooter>
    </Card>
  );
}
