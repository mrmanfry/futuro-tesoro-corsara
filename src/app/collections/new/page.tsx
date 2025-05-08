import { CollectionForm } from '@/components/collections/CollectionForm';

export default function NewCollectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Crea una nuova raccolta
            </h1>
            <div className="mt-6">
              <CollectionForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
