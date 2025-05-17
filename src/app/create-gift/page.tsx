"use client";

import { CreateGiftProvider } from '@/context/CreateGiftContext';
import ChildDetailsStep from '@/components/collections/steps/ChildDetailsStep';
import { useState, useEffect } from 'react';
import ThemeStep from '@/app/create-gift/theme/page';
import MessageStep from '@/app/create-gift/message/page';
import PreviewStep from '@/app/create-gift/preview/page';
import SubmitStep from '@/app/create-gift/submit/page';
import { useCreateGiftContext } from '@/context/CreateGiftContext';

const steps = [
  { id: 'child', label: 'Bambino', component: ChildDetailsStep },
  { id: 'theme', label: 'Tema', component: ThemeStep },
  { id: 'message', label: 'Messaggio', component: MessageStep },
  { id: 'preview', label: 'Anteprima', component: PreviewStep },
  { id: 'submit', label: 'Conferma', component: SubmitStep },
];

export default function CreateGiftWizard() {
  const [step, setStep] = useState(0);
  const StepComponent = steps[step].component;
  const { reset } = useCreateGiftContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') !== 'create-gift-preview') {
      reset();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Crea una nuova raccolta regalo</h1>
        <div className="flex gap-2">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className={`rounded-full w-3 h-3 ${idx === step ? 'bg-ftb-blue-600' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
      <StepComponent />
    </div>
  );
} 