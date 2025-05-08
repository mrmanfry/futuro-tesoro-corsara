'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Heart, MessageSquare } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { GiftContribution } from '@/types/database';

interface ContributionsListProps {
  collectionId: string;
}

export function ContributionsList({ collectionId }: ContributionsListProps) {
  const [contributions, setContributions] = useState<GiftContribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchContributions() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('gift_contributions')
          .select('*')
          .eq('collection_id', collectionId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setContributions(data || []);
      } catch (err) {
        console.error('Errore nel recupero dei contributi:', err);
        setError(
          'Non è stato possibile recuperare i contributi. Riprova più tardi.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, [collectionId, supabase]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <EmptyState title="Si è verificato un errore" description={error} />;
  }

  if (contributions.length === 0) {
    return (
      <EmptyState
        title="Nessun contributo"
        description="Non hai ancora ricevuto contributi per questa raccolta."
      />
    );
  }

  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <Card key={contribution.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{contribution.donor_name}</span>
                {contribution.donor_relation && (
                  <Badge variant="outline">{contribution.donor_relation}</Badge>
                )}
              </div>

              <div className="mt-1 text-sm text-muted-foreground">
                {format(new Date(contribution.created_at), 'PPP', {
                  locale: it,
                })}
              </div>

              {contribution.message && (
                <div className="mt-3 text-sm">
                  <div className="mb-1 flex items-center gap-1 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messaggio</span>
                  </div>
                  <p className="italic">{contribution.message}</p>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-xl font-bold">
                €{contribution.amount.toFixed(2)}
              </div>
              {contribution.stripe_receipt_url && (
                <a
                  href={contribution.stripe_receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Vedi ricevuta
                </a>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
