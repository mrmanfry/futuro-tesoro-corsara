import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { PublicCollectionView } from '@/components/collections/public-collection-view';
import { ContributionForm } from '@/components/collections/contribution-form';

export const dynamicParams = true;

export async function generateMetadata({ params }) {
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
    title: `Contribuisci alla raccolta per ${collection.child_name} | Futuro Tesoro`,
    description:
      collection.message ||
      `Contribuisci alla raccolta regalo per ${collection.child_name}`,
  };
}

async function getCollection(id: string) {
  const supabase = createServerComponentClient({ cookies });

  const { data: collection, error } = await supabase
    .from('gift_collections')
    .select(
      `
      *,
      gift_contributions (
        amount
      )
    `
    )
    .eq('id', id)
    .single();

  if (error || !collection) {
    return null;
  }

  // Calcola il totale raccolto
  const totalAmount =
    collection.gift_contributions?.reduce(
      (sum, contribution) => sum + contribution.amount,
      0
    ) || 0;

  return {
    ...collection,
    total_amount: totalAmount,
  };
}

export default async function GivePage({ params }) {
  const collection = await getCollection(params.id);

  if (!collection) {
    notFound();
  }

  // Verifica che la raccolta sia attiva
  if (collection.status !== 'active') {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Raccolta non disponibile</h1>
          <p className="text-muted-foreground">
            Questa raccolta non è più attiva o è stata chiusa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ftb-blue-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <PublicCollectionView collection={collection} />
          </div>

          <div className="lg:sticky lg:top-8">
            <ContributionForm collection={collection} />
          </div>
        </div>
      </div>
    </div>
  );
}
