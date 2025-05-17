"use client";
// import Navbar from '@/components/layout/Navbar';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Verifica il tuo indirizzo email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Ti abbiamo inviato un'email con un link di verifica. Clicca sul
                link per attivare il tuo account.
              </p>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Non hai ricevuto l'email?{' '}
                  <a
                    href={from ? `/auth/login?from=${from}` : '/auth/login'}
                    className="font-medium text-ftb-blue-600 hover:text-ftb-blue-500"
                  >
                    Torna alla pagina di login
                  </a>
                </p>
                {from === 'create-gift' && (
                  <div className="mt-4">
                    <a
                      href="/create-gift"
                      className="font-medium text-green-700 hover:text-green-900 underline"
                    >
                      Torna a creare la tua raccolta regalo
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
