'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { GiftIcon, Calendar, Users, TrendingUp } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GiftCollection } from '@/types/database';

interface CollectionCardProps {
  collection: GiftCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const [totalAmount, setTotalAmount] = useState(0);
  const [contributionsCount, setContributionsCount] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchStats() {
      const { data: contributions } = await supabase
        .from('gift_contributions')
        .select('amount')
        .eq('collection_id', collection.id)
        .eq('payment_status', 'completed');

      if (contributions) {
        const total = contributions.reduce(
          (sum, contribution) => sum + contribution.amount,
          0
        );
        setTotalAmount(total);
        setContributionsCount(contributions.length);
      }
    }

    fetchStats();
  }, [collection.id, supabase]);

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

  const getStatusBadge = () => {
    switch (collection.status) {
      case 'active':
        return <Badge variant="success">Attiva</Badge>;
      case 'completed':
        return <Badge variant="default">Completata</Badge>;
      case 'closed':
        return <Badge variant="secondary">Chiusa</Badge>;
      default:
        return <Badge variant="outline">In attesa</Badge>;
    }
  };

  return (
    <Link href={`/collections/${collection.id}`} passHref>
      <Card className="hover:border-ftb-blue/40 h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{collection.child_name}</CardTitle>
            {getStatusBadge()}
          </div>
          <CardDescription>
            {collection.occasion || 'Raccolta regalo'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {collection.target_amount ? (
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Raccolto: €{totalAmount.toFixed(2)}</span>
                  <span>Obiettivo: €{collection.target_amount}</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground">
                <GiftIcon className="mr-2 h-4 w-4" />
                <span>Raccolta senza obiettivo</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Creata{' '}
                  {formatDistanceToNow(new Date(collection.created_at), {
                    addSuffix: true,
                    locale: it,
                  })}
                </span>
              </div>

              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {contributionsCount}{' '}
                  {contributionsCount === 1 ? 'donatore' : 'donatori'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <div className="flex w-full items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {collection.theme || 'Tema standard'}
            </span>
            <span className="text-ftb-blue inline-flex items-center">
              Visualizza
              <TrendingUp className="ml-1 h-4 w-4" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
