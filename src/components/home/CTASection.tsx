import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-[#4286f4] to-[#27408b] py-20 text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-start px-4">
        <h2 className="mb-4 text-left text-3xl font-extrabold md:text-4xl">
          Regala un investimento che cresce con loro
        </h2>
        <p className="mb-10 max-w-2xl text-left text-lg text-blue-100 md:text-xl">
          Inizia oggi a costruire il futuro finanziario dei bambini a cui vuoi
          bene.
        </p>
        <div className="mb-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="flex w-full items-center justify-center gap-2 bg-white px-8 text-base font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 sm:w-auto"
            >
              Crea un Regalo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#simulatore" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="flex w-full items-center justify-center gap-2 bg-blue-600 px-8 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 sm:w-auto"
            >
              Prova il Simulatore <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-2 text-left text-base text-blue-100">
          Oltre 1000 famiglie hanno già scelto di investire nel futuro dei loro
          bambini.
        </div>
      </div>
    </section>
  );
}
