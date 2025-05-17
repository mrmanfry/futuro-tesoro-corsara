'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WalletSetupSuccessPage() {
  const { collectionId } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to collection page after 5 seconds
    const timeout = setTimeout(() => {
      router.push(`/app/collections/${collectionId}`);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [collectionId, router]);

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="bg-green-100 text-green-700 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-4">Wallet configurato con successo!</h1>

      <p className="mb-6">
        Il tuo wallet è stato configurato correttamente. Ora puoi ricevere i fondi
        delle donazioni.
      </p>

      <div className="space-y-4">
        <Link
          href={`/app/collections/${collectionId}`}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Vai alla raccolta
        </Link>

        <Link
          href="/app/collections"
          className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200"
        >
          Torna alle raccolte
        </Link>
      </div>
    </div>
  );
} 