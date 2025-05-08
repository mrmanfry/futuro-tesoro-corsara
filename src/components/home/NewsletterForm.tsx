import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewsletterForm() {
  return (
    <section className="bg-[#f8fafc] py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-col items-center gap-8 rounded-2xl border border-blue-100 bg-blue-50/60 p-8 shadow-sm md:flex-row md:items-start">
          {/* Icona */}
          <div className="flex w-full flex-shrink-0 flex-col items-center justify-center md:w-auto">
            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-9 w-9 text-blue-500" />
            </div>
          </div>
          {/* Testo e form */}
          <div className="w-full flex-1">
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              Rimani aggiornato
            </h3>
            <p className="mb-4 text-gray-600">
              Iscriviti alla nostra newsletter per ricevere consigli
              sull'educazione finanziaria e aggiornamenti sulle nostre
              funzionalità.
            </p>
            <form className="mb-2 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="La tua email"
                className="flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-base text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Button
                type="submit"
                className="rounded-full bg-blue-500 px-7 py-3 text-base font-semibold text-white shadow hover:bg-blue-600"
              >
                Iscriviti
              </Button>
            </form>
            <div className="text-xs text-gray-500">
              Non invieremo mai spam. Leggi la nostra{' '}
              <a
                href="/privacy"
                className="text-blue-500 underline hover:text-blue-700"
              >
                Privacy Policy
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
