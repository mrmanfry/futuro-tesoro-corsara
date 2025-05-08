import { useFormContext, useWatch } from 'react-hook-form';
import type { CollectionFormData } from '@/types/collection';

const occasions = [
  { id: 'battesimo', label: 'Battesimo' },
  { id: 'compleanno', label: 'Compleanno' },
  { id: 'comunione', label: 'Comunione' },
  { id: 'cresima', label: 'Cresima' },
  { id: 'altro', label: 'Altro' },
] as const;

export function ThemeStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CollectionFormData>();

  const occasion = useWatch({ name: 'occasion' });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Tema e obiettivi</h2>
        <p className="mt-1 text-sm text-gray-500">
          Scegli l'occasione e personalizza il tema della raccolta.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700">Occasione</label>
          <div className="mt-2 space-y-4">
            {occasions.map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  type="radio"
                  id={item.id}
                  value={item.id}
                  {...register('occasion')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label
                  htmlFor={item.id}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          {errors.occasion && (
            <p className="mt-2 text-sm text-red-600">
              {errors.occasion.message}
            </p>
          )}
        </div>

        {occasion === 'altro' && (
          <div>
            <label
              htmlFor="customOccasion"
              className="block text-sm font-medium text-gray-700"
            >
              Specifica l'occasione
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="customOccasion"
                {...register('customOccasion')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="theme"
            className="block text-sm font-medium text-gray-700"
          >
            Tema della raccolta
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="theme"
              {...register('theme')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="es. Regalo per il battesimo di Marco"
            />
          </div>
          {errors.theme && (
            <p className="mt-2 text-sm text-red-600">{errors.theme.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="targetAmount"
            className="block text-sm font-medium text-gray-700"
          >
            Importo target (opzionale)
          </label>
          <div className="mt-2">
            <input
              type="number"
              id="targetAmount"
              {...register('targetAmount', { valueAsNumber: true })}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="es. 1000"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            Data di chiusura (opzionale)
          </label>
          <div className="mt-2">
            <input
              type="date"
              id="endDate"
              {...register('endDate')}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
