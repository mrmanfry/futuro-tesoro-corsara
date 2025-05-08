import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { CollectionsGrid } from '@/components/collections/collections-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Le tue raccolte | Futuro Tesoro',
  description: 'Gestisci le tue raccolte regalo per il futuro dei bambini',
};

export default async function CollectionsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Le tue collezioni</h1>
        <Link href="/collections/new">
          <Button variant="default">Nuova Collezione</Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <span>Caricamento...</span>
          </div>
        }
      >
        <CollectionsGrid userId={user.id} />
      </Suspense>
    </div>
  );
}
