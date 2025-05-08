import { useFormContext } from 'react-hook-form';
import type { CollectionFormData } from '@/types/collection';

export function ChildDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CollectionFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Dati del bambino</h2>
        <p className="mt-1 text-sm text-gray-500">
          Inserisci i dati del bambino per cui stai creando la raccolta.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.firstName && (
            <p className="mt-2 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Cognome
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.lastName && (
            <p className="mt-2 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Data di nascita
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="dateOfBirth"
              {...register('dateOfBirth')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.dateOfBirth && (
            <p className="mt-2 text-sm text-red-600">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
