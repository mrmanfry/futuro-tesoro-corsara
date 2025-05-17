"use client";
import { CreateGiftProvider } from '@/context/CreateGiftContext';

export default function CreateGiftLayout({ children }: { children: React.ReactNode }) {
  return (
    <CreateGiftProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8">
        {/* Qui puoi aggiungere uno stepper/breadcrumb se vuoi */}
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </CreateGiftProvider>
  );
} 