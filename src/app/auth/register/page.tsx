import { AuthForm } from '@/components/auth/AuthForm';
import Navbar from '@/components/layout/Navbar';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Crea un nuovo account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Oppure{' '}
            <a
              href="/auth/login"
              className="font-medium text-ftb-blue-600 hover:text-ftb-blue-500"
            >
              accedi al tuo account esistente
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <AuthForm mode="sign-up" />
          </div>
        </div>
      </div>
    </div>
  );
}
