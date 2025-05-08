'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  collectionFormSchema,
  type CollectionFormData,
} from '@/types/collection';
import { ChildDetailsStep } from './steps/ChildDetailsStep';
import { ThemeStep } from './steps/ThemeStep';
import { MessageStep } from './steps/MessageStep';
import { PreviewStep } from './steps/PreviewStep';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const steps = [
  { id: 'child-details', title: 'Dati del bambino' },
  { id: 'theme', title: 'Tema e obiettivi' },
  { id: 'message', title: 'Messaggio' },
  { id: 'preview', title: 'Anteprima' },
];

export function CollectionForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      isPublic: false,
    },
  });

  const { handleSubmit, trigger } = methods;

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number): (keyof CollectionFormData)[] => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'dateOfBirth'];
      case 1:
        return [
          'occasion',
          'customOccasion',
          'theme',
          'targetAmount',
          'endDate',
        ];
      case 2:
        return ['message', 'isPublic'];
      default:
        return [];
    }
  };

  const onSubmit = async (data: CollectionFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            'Si è verificato un errore durante la creazione della raccolta'
        );
      }

      toast.success('Raccolta creata con successo!', {
        description:
          'La tua raccolta è stata creata. Ora puoi condividerla con amici e parenti.',
      });

      router.push(`/collections/${result.collection.id}`);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore', {
        description:
          error instanceof Error
            ? error.message
            : 'Non è stato possibile creare la raccolta. Riprova più tardi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ChildDetailsStep />;
      case 1:
        return <ThemeStep />;
      case 2:
        return <MessageStep />;
      case 3:
        return <PreviewStep />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="border-b border-gray-200 pb-5">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`
                  whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
                  ${
                    index === currentStep
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                `}
              >
                {step.title}
              </button>
            ))}
          </nav>
        </div>

        {renderStep()}

        <div className="flex justify-between pt-5">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Indietro
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size={16} className="mr-2" />
                  Creazione in corso...
                </>
              ) : (
                'Crea raccolta'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Avanti
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
