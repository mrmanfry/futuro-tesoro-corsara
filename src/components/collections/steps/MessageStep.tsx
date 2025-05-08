import { useFormContext } from 'react-hook-form';
import type { CollectionFormData } from '@/types/collection';

export function MessageStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CollectionFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Messaggio</h2>
        <p className="mt-1 text-sm text-gray-500">
          Scrivi un messaggio per spiegare lo scopo della raccolta e invitare
          amici e parenti a partecipare.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Messaggio
          </label>
          <div className="mt-2">
            <textarea
              id="message"
              rows={4}
              {...register('message')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Scrivi qui il tuo messaggio..."
            />
          </div>
          {errors.message && (
            <p className="mt-2 text-sm text-red-600">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="isPublic"
              type="checkbox"
              {...register('isPublic')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="isPublic" className="font-medium text-gray-900">
              Rendi pubblica la raccolta
            </label>
            <p className="text-gray-500">
              La raccolta sarà visibile a tutti coloro che hanno il link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
