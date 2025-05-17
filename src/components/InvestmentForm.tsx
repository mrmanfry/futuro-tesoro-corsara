import { useState } from 'react';
import { useForm, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button/index';
import { Input } from '@/components/ui/input/index';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form/index';
import { formatCurrency } from '@/lib/utils/index';

interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  riskLevel: number;
  expectedReturn: number;
  minimumInvestment: number;
  fees: number;
}

const investmentSchema = z.object({
  planId: z.string().min(1, 'Please select an investment plan'),
  amount: z.number().min(1000, 'Minimum investment amount is €1,000')
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  availablePlans: InvestmentPlan[];
  maxAmount: number;
  onSubmit: (data: InvestmentFormData) => Promise<void>;
}

export function InvestmentForm({ availablePlans, maxAmount, onSubmit }: InvestmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      planId: '',
      amount: 0
    }
  });

  const handleSubmit = async (data: InvestmentFormData) => {
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

  const handlePlanChange = (planId: string) => {
    const plan = availablePlans.find(p => p.id === planId);
    setSelectedPlan(plan || null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Investment Details</h2>
        <p className="text-muted-foreground">
          Select an investment plan and specify the amount you wish to invest.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="planId"
            render={({ field }: { field: ControllerRenderProps<InvestmentFormData, 'planId'> }) => (
              <FormItem>
                <FormLabel>Investment Plan</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handlePlanChange(e.target.value);
                    }}
                  >
                    <option value="">Select a plan</option>
                    {availablePlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - Risk Level {plan.riskLevel}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedPlan && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">{selectedPlan.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Expected Return</p>
                  <p className="font-medium">{selectedPlan.expectedReturn}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Annual Fees</p>
                  <p className="font-medium">{selectedPlan.fees}%</p>
                </div>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="amount"
            render={({ field }: { field: ControllerRenderProps<InvestmentFormData, 'amount'> }) => (
              <FormItem>
                <FormLabel>Investment Amount (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={selectedPlan?.minimumInvestment || 1000}
                    max={maxAmount}
                    step="100"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-sm text-muted-foreground mt-1">
                  Available amount: {formatCurrency(maxAmount)}
                </p>
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
            {isSubmitting ? 'Processing...' : 'Confirm Investment'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 