import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Create New Collection Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-ftb-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Crea una nuova raccolta
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Inizia una nuova raccolta fondi per il futuro dei tuoi
                      bambini.
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href="/collections/new"
                    className="inline-flex items-center rounded-md border border-transparent bg-ftb-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ftb-blue-700 focus:outline-none focus:ring-2 focus:ring-ftb-blue-500 focus:ring-offset-2"
                  >
                    Crea raccolta
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Collections Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-ftb-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Raccolte attive
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Visualizza e gestisci le tue raccolte fondi attive.
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href="/collections"
                    className="inline-flex items-center rounded-md border border-transparent bg-ftb-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ftb-blue-700 focus:outline-none focus:ring-2 focus:ring-ftb-blue-500 focus:ring-offset-2"
                  >
                    Vedi raccolte
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Settings Card */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-ftb-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      Impostazioni profilo
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Gestisci le informazioni del tuo profilo e le preferenze.
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href="/settings"
                    className="inline-flex items-center rounded-md border border-transparent bg-ftb-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ftb-blue-700 focus:outline-none focus:ring-2 focus:ring-ftb-blue-500 focus:ring-offset-2"
                  >
                    Impostazioni
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
