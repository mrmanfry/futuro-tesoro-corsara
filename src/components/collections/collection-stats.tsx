'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { TrendingUp, Users, Gift } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GiftCollection } from '@/types/database';

interface CollectionStatsProps {
  collection: GiftCollection;
}

export function CollectionStats({ collection }: CollectionStatsProps) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [contributionsCount, setContributionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);

        // Fetch total amount
        const { data: contributions, error: contributionsError } =
          await supabase
            .from('gift_contributions')
            .select('amount')
            .eq('collection_id', collection.id);

        if (contributionsError) {
          throw contributionsError;
        }

        // Calculate total and count
        const total =
          contributions?.reduce(
            (sum, contribution) => sum + contribution.amount,
            0
          ) || 0;
        setTotalAmount(total);
        setContributionsCount(contributions?.length || 0);
      } catch (err) {
        console.error('Errore nel recupero delle statistiche:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [collection.id, supabase]);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!collection.target_amount || collection.target_amount <= 0) {
      return 0;
    }

    const percentage = Math.min(
      Math.round((totalAmount / collection.target_amount) * 100),
      100
    );
    return percentage;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Statistiche</CardTitle>
          <CardDescription>Riepilogo dei fondi raccolti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Totale raccolto
              </span>
              <span className="text-2xl font-bold">
                €{totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Contributori
              </span>
              <span className="text-2xl font-bold">{contributionsCount}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Obiettivo</span>
              <span className="text-2xl font-bold">
                {collection.target_amount
                  ? `€${collection.target_amount.toFixed(2)}`
                  : '−'}
              </span>
            </div>
          </div>

          {collection.target_amount > 0 && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm">
                <span>{calculateProgress()}% completato</span>
                <span>
                  €{totalAmount.toFixed(2)} / €
                  {collection.target_amount.toFixed(2)}
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
