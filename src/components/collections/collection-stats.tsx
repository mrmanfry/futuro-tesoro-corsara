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

        // Fetch contributions with completed status
        const { data: contributions, error: contributionsError } = await supabase
          .from('gift_contributions')
          .select('amount')
          .eq('collection_id', collection.id)
          .eq('payment_status', 'completed');

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
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Totale Raccolto</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalAmount.toFixed(2)}</div>
          {collection.target_amount && (
            <Progress
              value={calculateProgress()}
              className="mt-2 h-2"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contributi</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contributionsCount}</div>
          <p className="text-xs text-muted-foreground">
            {contributionsCount === 1
              ? 'Contributo ricevuto'
              : 'Contributi ricevuti'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Obiettivo</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {collection.target_amount
              ? `€${collection.target_amount.toFixed(2)}`
              : 'Libero'}
          </div>
          {collection.target_amount && (
            <p className="text-xs text-muted-foreground">
              {calculateProgress()}% completato
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
