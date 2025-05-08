import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Gift, Calendar, Users, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GiftCollection } from '@/types/database';

interface PublicCollectionViewProps {
  collection: GiftCollection & { total_amount: number };
}

export function PublicCollectionView({
  collection,
}: PublicCollectionViewProps) {
  // Calcola la percentuale di completamento
  const calculateProgress = () => {
    if (!collection.target_amount || collection.target_amount <= 0) {
      return 0;
    }

    const percentage = Math.min(
      Math.round((collection.total_amount / collection.target_amount) * 100),
      100
    );
    return percentage;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Raccolta per {collection.child_name}
        </h1>
        <p className="mt-1 text-muted-foreground">{collection.occasion}</p>
      </div>

      {collection.message && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg italic">{collection.message}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Totale raccolto
              </span>
              <span className="text-2xl font-bold">
                €{collection.total_amount.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                Contributori
              </span>
              <span className="text-2xl font-bold">
                {collection.contributor_count}
              </span>
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
                  €{collection.total_amount.toFixed(2)} / €
                  {collection.target_amount.toFixed(2)}
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Creata il{' '}
          {format(new Date(collection.created_at), 'PP', { locale: it })}
        </div>

        {collection.theme && (
          <div className="flex items-center">
            <Gift className="mr-2 h-4 w-4" />
            Tema: {collection.theme}
          </div>
        )}
      </div>
    </div>
  );
}
