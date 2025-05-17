"use client";
import { useRouter } from 'next/navigation';
import { useCreateGiftContext } from '@/context/CreateGiftContext';
import { Button } from '@/components/ui/button';

const STOCK_IMAGES: Record<string, string> = {
  'università': '/stock/universita.jpg',
  'macchina': '/stock/macchina.jpg',
  'viaggio': '/stock/viaggio.jpg',
  'casa': '/stock/casa.jpg',
  'sport': '/stock/sport.jpg',
  'altro': '/stock/altro.jpg',
};

export default function PreviewStep() {
  const router = useRouter();
  const { state } = useCreateGiftContext();
  const { childDetails, theme, message } = state;
  const themeLabel = theme.type === 'altro' ? theme.custom : theme.type;
  const imageUrl = state.photo || (theme.type === 'università' ? STOCK_IMAGES[theme.type] : '/stock/default.jpg');

  const defaultMessage = `Per ${themeLabel} di ${childDetails.name} ${childDetails.lastName} abbiamo deciso di porre tutti insieme un piccolo mattone per la vita futura di ${childDetails.name} ${childDetails.lastName}`;
  const showMessage = message?.trim() ? message : defaultMessage;

  const handleBack = () => {
    router.push('/create-gift/theme');
  };

  const handleNext = () => {
    router.push('/create-gift/submit');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Anteprima raccolta</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          <img src={imageUrl} alt="Foto raccolta" className="object-cover w-full h-full" />
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded ${theme.color || 'bg-gray-100'}`}>
          <span className="text-2xl">{theme.icon}</span>
          <span className="font-semibold text-lg">{themeLabel}</span>
        </div>
        <div className="text-xl font-bold">{childDetails.name} {childDetails.lastName}</div>
        <div className="text-gray-500">Nato il {childDetails.birthdate}</div>
        <div className="text-base mt-2 text-center">{showMessage}</div>
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleBack}>Indietro</Button>
        <Button onClick={handleNext}>Avanti</Button>
      </div>
    </div>
  );
} 