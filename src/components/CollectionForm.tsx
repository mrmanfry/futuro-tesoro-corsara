import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button/index';
import { Input } from '@/components/ui/input/index';
import { Textarea } from '@/components/ui/textarea/index';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form/index';
import { formatCurrency } from '@/lib/utils/index';

const collectionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetAmount: z.number().min(1, 'Target amount must be at least €1'),
  childName: z.string().min(2, 'Child name must be at least 2 characters'),
  childDob: z.string().refine((date) => {
    const dob = new Date(date);
    const now = new Date();
    return dob <= now;
  }, 'Date of birth cannot be in the future')
});

type CollectionFormData = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  initialData?: Partial<CollectionFormData>;
  onSubmit: (data: CollectionFormData) => Promise<void>;
  submitLabel?: string;
}

export function CollectionForm({ initialData, onSubmit, submitLabel = 'Create Collection' }: CollectionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      targetAmount: initialData?.targetAmount || 0,
      childName: initialData?.childName || '',
      childDob: initialData?.childDob || '',
    }
  });

  const handleSubmit = async (data: CollectionFormData) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }: { field: ControllerRenderProps<CollectionFormData, 'title'> }) => (
            <FormItem>
              <FormLabel>Collection Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., College Fund for Sarah" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }: { field: ControllerRenderProps<CollectionFormData, 'description'> }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the purpose of this collection..."
                  className="resize-none"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }: { field: ControllerRenderProps<CollectionFormData, 'targetAmount'> }) => (
            <FormItem>
              <FormLabel>Target Amount (€)</FormLabel>
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
          name="childName"
          render={({ field }: { field: ControllerRenderProps<CollectionFormData, 'childName'> }) => (
            <FormItem>
              <FormLabel>Child's Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your child's name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="childDob"
          render={({ field }: { field: ControllerRenderProps<CollectionFormData, 'childDob'> }) => (
            <FormItem>
              <FormLabel>Child's Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
          {isSubmitting ? 'Processing...' : submitLabel}
        </Button>
      </form>
    </Form>
  );
} 