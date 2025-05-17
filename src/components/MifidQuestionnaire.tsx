import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button/index';
import { Input } from '@/components/ui/input/index';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form/index';

const mifidSchema = z.object({
  investmentExperience: z.enum(['none', 'limited', 'moderate', 'extensive']),
  investmentHorizon: z.enum(['short', 'medium', 'long']),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  investmentObjectives: z.enum(['preservation', 'income', 'growth', 'aggressive']),
  annualIncome: z.number().min(0, 'Annual income must be a positive number'),
  liquidAssets: z.number().min(0, 'Liquid assets must be a positive number')
});

type MifidFormData = z.infer<typeof mifidSchema>;

interface MifidQuestionnaireProps {
  onSubmit: (data: MifidFormData) => Promise<void>;
}

export function MifidQuestionnaire({ onSubmit }: MifidQuestionnaireProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MifidFormData>({
    resolver: zodResolver(mifidSchema),
    defaultValues: {
      investmentExperience: 'none',
      investmentHorizon: 'medium',
      riskTolerance: 'medium',
      investmentObjectives: 'growth',
      annualIncome: 0,
      liquidAssets: 0
    }
  });

  const handleSubmit = async (data: MifidFormData) => {
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
        <h2 className="text-2xl font-bold mb-2">Investment Profile Questionnaire</h2>
        <p className="text-muted-foreground">
          Please complete this questionnaire to help us understand your investment profile and recommend suitable investment options.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="investmentExperience"
            render={({ field }: { field: ControllerRenderProps<MifidFormData, 'investmentExperience'> }) => (
              <FormItem>
                <FormLabel>Investment Experience</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="none">No prior investment experience</option>
                    <option value="limited">Limited experience (1-2 years)</option>
                    <option value="moderate">Moderate experience (3-5 years)</option>
                    <option value="extensive">Extensive experience (5+ years)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investmentHorizon"
            render={({ field }: { field: ControllerRenderProps<MifidFormData, 'investmentHorizon'> }) => (
              <FormItem>
                <FormLabel>Investment Time Horizon</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="short">Short term (1-3 years)</option>
                    <option value="medium">Medium term (3-7 years)</option>
                    <option value="long">Long term (7+ years)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="riskTolerance"
            render={({ field }: { field: ControllerRenderProps<MifidFormData, 'riskTolerance'> }) => (
              <FormItem>
                <FormLabel>Risk Tolerance</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="low">Low - Prefer stable investments with lower returns</option>
                    <option value="medium">Medium - Balance between stability and growth</option>
                    <option value="high">High - Willing to accept higher risk for higher returns</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investmentObjectives"
            render={({ field }: { field: ControllerRenderProps<MifidFormData, 'investmentObjectives'> }) => (
              <FormItem>
                <FormLabel>Investment Objectives</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                  >
                    <option value="preservation">Capital Preservation</option>
                    <option value="income">Regular Income</option>
                    <option value="growth">Capital Growth</option>
                    <option value="aggressive">Aggressive Growth</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }: { field: ControllerRenderProps<MifidFormData, 'annualIncome'> }) => (
              <FormItem>
                <FormLabel>Annual Income (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
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
            name="liquidAssets"
            render={({ field }: { field: ControllerRenderProps<MifidFormData, 'liquidAssets'> }) => (
              <FormItem>
                <FormLabel>Liquid Assets (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1000"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
            {isSubmitting ? 'Processing...' : 'Submit Questionnaire'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 