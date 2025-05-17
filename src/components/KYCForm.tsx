import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button/index';
import { Input } from '@/components/ui/input/index';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form/index';

const kycSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - dob.getFullYear();
    return age >= 18;
  }, 'You must be at least 18 years old'),
  nationality: z.string().min(2, 'Nationality is required'),
  address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    postalCode: z.string().min(4, 'Postal code must be at least 4 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters')
  }),
  idDocument: z.object({
    type: z.enum(['passport', 'idCard', 'drivingLicense']),
    number: z.string().min(5, 'Document number must be at least 5 characters'),
    expiryDate: z.string().refine((date) => {
      const expiry = new Date(date);
      const now = new Date();
      return expiry > now;
    }, 'Document must not be expired'),
    file: z.instanceof(File).optional()
  }),
  proofOfAddress: z.instanceof(File).optional()
});

type KYCFormData = z.infer<typeof kycSchema>;

interface KYCFormProps {
  onSubmit: (data: KYCFormData) => Promise<void>;
}

export function KYCForm({ onSubmit }: KYCFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: ''
      },
      idDocument: {
        type: 'passport',
        number: '',
        expiryDate: ''
      }
    }
  });

  const handleSubmit = async (data: KYCFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
        <p className="text-muted-foreground">
          Please provide your personal information and documents for verification.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }: { field: ControllerRenderProps<KYCFormData, 'firstName'> }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }: { field: ControllerRenderProps<KYCFormData, 'lastName'> }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }: { field: ControllerRenderProps<KYCFormData, 'dateOfBirth'> }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }: { field: ControllerRenderProps<KYCFormData, 'nationality'> }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address</h3>
            
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }: { field: ControllerRenderProps<KYCFormData, 'address.street'> }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }: { field: ControllerRenderProps<KYCFormData, 'address.city'> }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }: { field: ControllerRenderProps<KYCFormData, 'address.postalCode'> }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }: { field: ControllerRenderProps<KYCFormData, 'address.country'> }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identity Document</h3>

            <FormField
              control={form.control}
              name="idDocument.type"
              render={({ field }: { field: ControllerRenderProps<KYCFormData, 'idDocument.type'> }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      {...field}
                    >
                      <option value="passport">Passport</option>
                      <option value="idCard">ID Card</option>
                      <option value="drivingLicense">Driving License</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="idDocument.number"
                render={({ field }: { field: ControllerRenderProps<KYCFormData, 'idDocument.number'> }) => (
                  <FormItem>
                    <FormLabel>Document Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idDocument.expiryDate"
                render={({ field }: { field: ControllerRenderProps<KYCFormData, 'idDocument.expiryDate'> }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idDocument.file"
              render={({ field: { value, onChange, ...field } }: { field: ControllerRenderProps<KYCFormData, 'idDocument.file'> }) => (
                <FormItem>
                  <FormLabel>Upload Document</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="proofOfAddress"
            render={({ field: { value, onChange, ...field } }: { field: ControllerRenderProps<KYCFormData, 'proofOfAddress'> }) => (
              <FormItem>
                <FormLabel>Proof of Address</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Submit Verification'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 