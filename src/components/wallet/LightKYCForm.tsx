import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "Nome obbligatorio"),
  lastName: z.string().min(2, "Cognome obbligatorio"),
  birthday: z.string().min(8, "Data di nascita obbligatoria"),
  nationality: z.string().min(2, "Nazionalità obbligatoria"),
  countryOfResidence: z.string().min(2, "Paese di residenza obbligatorio"),
  address: z.string().min(2, "Indirizzo obbligatorio"),
  city: z.string().min(2, "Città obbligatoria"),
  postalCode: z.string().min(2, "CAP obbligatorio"),
  country: z.string().min(2, "Nazione obbligatoria"),
});

type FormData = z.infer<typeof formSchema>;

interface LightKYCFormProps {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function LightKYCForm({ onSuccess, onError }: LightKYCFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Invia i dati a MangoPay tramite l'API
      const response = await fetch("/api/mangopay/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          lightKYC: true,
        }),
      });
      if (!response.ok) throw new Error("Errore durante l'invio dei dati");
      toast({
        title: "Dati inviati",
        description: "I tuoi dati sono stati inviati con successo. Riceverai una notifica quando la verifica sarà completata.",
      });
      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Errore durante l'invio dei dati"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="firstName">Nome</Label>
          <Input id="firstName" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Cognome</Label>
          <Input id="lastName" {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.lastName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="birthday">Data di nascita</Label>
          <Input id="birthday" type="date" {...form.register("birthday")} />
          {form.formState.errors.birthday && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.birthday.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="nationality">Nazionalità</Label>
          <Input id="nationality" {...form.register("nationality")} />
          {form.formState.errors.nationality && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.nationality.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="countryOfResidence">Paese di residenza</Label>
          <Input id="countryOfResidence" {...form.register("countryOfResidence")} />
          {form.formState.errors.countryOfResidence && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.countryOfResidence.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="address">Indirizzo</Label>
          <Input id="address" {...form.register("address")} />
          {form.formState.errors.address && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.address.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="city">Città</Label>
          <Input id="city" {...form.register("city")} />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postalCode">CAP</Label>
          <Input id="postalCode" {...form.register("postalCode")} />
          {form.formState.errors.postalCode && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.postalCode.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="country">Nazione</Label>
          <Input id="country" {...form.register("country")} />
          {form.formState.errors.country && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.country.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Invio in corso..." : "Invia dati"}
      </Button>
    </form>
  );
} 