import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button/index';
import { Input } from '@/components/ui/input/index';
import { Textarea } from '@/components/ui/textarea/index';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form/index';
import { Label } from '@/components/ui/label/index';
import { formatCurrency } from '@/lib/utils/index';

const contributionSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least €1'),
  contributorName: z.string().min(2, 'Name must be at least 2 characters'),
  contributorEmail: z.string().email('Invalid email address'),
  message: z.string().optional()
});

type ContributionFormData = z.infer<typeof contributionSchema>;

interface ContributionFormProps {
  collection: {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
  };
  onSuccess?: () => void;
}

export function ContributionForm({ collection, onSuccess }: ContributionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 0,
      contributorName: '',
      contributorEmail: '',
      message: ''
    }
  });

  const onSubmit = async (data: ContributionFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          collectionId: collection.id,
          ...data
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error creating contribution');
      }

      // Redirect to payment page
      window.location.href = result.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Contribute to {collection.title}</h2>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Current Progress</span>
          <span>{formatCurrency(collection.currentAmount)} / {formatCurrency(collection.targetAmount)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(collection.currentAmount / collection.targetAmount) * 100}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }: { field: ControllerRenderProps<ContributionFormData, 'amount'> }) => (
              <FormItem>
                <FormLabel>Amount (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contributorName"
            render={({ field }: { field: ControllerRenderProps<ContributionFormData, 'contributorName'> }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contributorEmail"
            render={({ field }: { field: ControllerRenderProps<ContributionFormData, 'contributorEmail'> }) => (
              <FormItem>
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }: { field: ControllerRenderProps<ContributionFormData, 'message'> }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a personal message..."
                    className="resize-none"
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
            {isSubmitting ? 'Processing...' : 'Contribute Now'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 