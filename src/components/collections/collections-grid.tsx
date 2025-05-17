'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GiftIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import { CollectionCard } from './collection-card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { GiftCollection } from '@/types/database';

interface CollectionsGridProps {
  userId: string;
}

export function CollectionsGrid({ userId }: CollectionsGridProps) {
  const [collections, setCollections] = useState<GiftCollection[]>([]);
  const [activeCollections, setActiveCollections] = useState<GiftCollection[]>(
    []
  );
  const [completedCollections, setCompletedCollections] = useState<
    GiftCollection[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchCollections() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('gift_collections')
          .select('*')
          .eq('created_by_user_id', userId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setCollections(data || []);

        // Filtra collezioni attive e completate
        setActiveCollections(data?.filter((c) => c.status === 'active') || []);
        setCompletedCollections(
          data?.filter((c) => ['completed', 'closed'].includes(c.status)) || []
        );
      } catch (err) {
        console.error('Errore nel recupero delle collezioni:', err);
        setError(
          'Non è stato possibile recuperare le tue raccolte. Riprova più tardi.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchCollections();
  }, [userId, supabase]);

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-10 w-10 text-destructive" />}
        title="Si è verificato un errore"
        description={error}
        action={
          <Button onClick={() => window.location.reload()}>Riprova</Button>
        }
      />
    );
  }

  if (collections.length === 0) {
    return (
      <EmptyState
        icon={<GiftIcon className="text-ftb-blue h-10 w-10" />}
        title="Nessuna raccolta trovata"
        description="Non hai ancora creato nessuna raccolta. Crea la tua prima raccolta per iniziare!"
        action={
          <Button asChild>
            <Link href="/create-gift">
              <GiftIcon className="mr-2 h-5 w-5" />
              Crea Raccolta
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <Tabs defaultValue="active">
      <TabsList className="mb-6">
        <TabsTrigger value="active">
          Attive ({activeCollections.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completate ({completedCollections.length})
        </TabsTrigger>
        <TabsTrigger value="all">Tutte ({collections.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-0">
        {activeCollections.length === 0 ? (
          <EmptyState
            title="Nessuna raccolta attiva"
            description="Non hai raccolte attive al momento."
            action={<Button asChild>
              <Link href="/create-gift">Crea Raccolta</Link>
            </Button>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="mt-0">
        {completedCollections.length === 0 ? (
          <EmptyState
            title="Nessuna raccolta completata"
            description="Non hai ancora completato nessuna raccolta."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedCollections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="all" className="mt-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
