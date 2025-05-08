import { z } from 'zod';

// Schema for child details
export const childDetailsSchema = z.object({
  firstName: z.string().min(2, 'Il nome deve essere di almeno 2 caratteri'),
  lastName: z.string().min(2, 'Il cognome deve essere di almeno 2 caratteri'),
  dateOfBirth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate < today;
  }, 'La data di nascita non può essere nel futuro'),
});

// Schema for collection theme and occasion
export const collectionThemeSchema = z.object({
  occasion: z.enum(
    ['battesimo', 'compleanno', 'comunione', 'cresima', 'altro'],
    {
      required_error: "Seleziona un'occasione",
    }
  ),
  customOccasion: z.string().optional(),
  theme: z.string().min(2, 'Il tema deve essere di almeno 2 caratteri'),
  targetAmount: z
    .number()
    .min(1, "L'importo target deve essere maggiore di 0")
    .optional(),
  endDate: z.string().optional(),
});

// Schema for collection message
export const collectionMessageSchema = z.object({
  message: z
    .string()
    .min(10, 'Il messaggio deve essere di almeno 10 caratteri'),
  isPublic: z.boolean().default(true),
});

// Combined schema for the entire collection form
export const collectionFormSchema = childDetailsSchema
  .merge(collectionThemeSchema)
  .merge(collectionMessageSchema);

// Type inference from the schema
export type ChildDetails = z.infer<typeof childDetailsSchema>;
export type CollectionTheme = z.infer<typeof collectionThemeSchema>;
export type CollectionMessage = z.infer<typeof collectionMessageSchema>;
export type CollectionFormData = z.infer<typeof collectionFormSchema>;

// Collection status enum
export enum CollectionStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
  INVESTED = 'invested',
}

// Collection type for database
export interface Collection {
  id: string;
  userId: string;
  childFirstName: string;
  childLastName: string;
  childDateOfBirth: string;
  occasion: string;
  customOccasion?: string;
  theme: string;
  message: string;
  isPublic: boolean;
  targetAmount?: number;
  endDate?: string;
  status: CollectionStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  contributorCount: number;
  slug: string;
}
