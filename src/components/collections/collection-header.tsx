import Link from 'next/link';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, Calendar, Gift } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { GiftCollection } from '@/types/database';

interface CollectionHeaderProps {
  collection: GiftCollection;
}

export function CollectionHeader({ collection }: CollectionHeaderProps) {
  // Helper per ottenere il badge di stato
  const getStatusBadge = () => {
    switch (collection.status) {
      case 'active':
        return <Badge variant="success">Attiva</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completata</Badge>;
      case 'closed':
        return <Badge variant="outline">Chiusa</Badge>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Link
        href="/collections"
        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Torna alle raccolte
      </Link>

      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Raccolta per {collection.child_name}
          </h1>
          <p className="mt-1 text-muted-foreground">{collection.occasion}</p>
        </div>

        <div className="mt-2 md:mt-0">{getStatusBadge()}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          Creata il{' '}
          {format(new Date(collection.created_at), 'PP', { locale: it })}
        </div>

        {collection.theme && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Gift className="mr-2 h-4 w-4" />
            Tema: {collection.theme}
          </div>
        )}
      </div>

      {collection.message && (
        <div className="mt-6 rounded-lg bg-muted p-4">
          <p className="italic">{collection.message}</p>
        </div>
      )}
    </div>
  );
}
