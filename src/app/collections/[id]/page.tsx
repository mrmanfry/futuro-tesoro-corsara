import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CollectionHeader } from '@/components/collections/collection-header';
import { CollectionStats } from '@/components/collections/collection-stats';
import { CollectionActions } from '@/components/collections/collection-actions';
import { ContributionsList } from '@/components/collections/contributions-list';

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: collection } = await supabase
    .from('gift_collections')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!collection) {
    return {
      title: 'Raccolta non trovata | Futuro Tesoro',
    };
  }

  return {
    title: `Raccolta per ${collection.child_name} | Futuro Tesoro`,
    description:
      collection.message || `Una raccolta regalo per ${collection.child_name}`,
  };
}

async function getCollection(id: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data: collection, error } = await supabase
    .from('gift_collections')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !collection) {
    return null;
  }

  return collection;
}

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/auth/login?callbackUrl=/collections/${params.id}`);
  }

  const collection = await getCollection(params.id);

  if (!collection) {
    notFound();
  }

  // Verifica che l'utente sia il proprietario della collezione
  if (collection.created_by_user_id !== session.user.id) {
    // Qui potremmo controllare se l'utente ha contribuito a questa collezione
    // Per ora, reindirizza alla dashboard
    redirect('/collections');
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <CollectionHeader collection={collection} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CollectionStats collection={collection} />

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Contributi ricevuti</h2>
            <Suspense fallback={<LoadingSpinner />}>
              <ContributionsList collectionId={collection.id} />
            </Suspense>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CollectionActions collection={collection} />
        </div>
      </div>
    </div>
  );
}
