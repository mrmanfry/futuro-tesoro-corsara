import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button/index';
import { formatCurrency } from '@/lib/utils/index';

interface Collection {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  childName: string;
  childDob: string;
  status: 'active' | 'completed' | 'pending';
  createdAt: string;
}

interface CollectionsGridProps {
  userId?: string;
  status?: 'active' | 'completed' | 'pending';
}

export function CollectionsGrid({ userId, status }: CollectionsGridProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (userId) queryParams.append('userId', userId);
        if (status) queryParams.append('status', status);

        const response = await fetch(`/api/collections?${queryParams}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error fetching collections');
        }

        setCollections(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [userId, status]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">No collections found</h3>
        <p className="text-muted-foreground mb-4">Start by creating a new collection for your child.</p>
        <Button asChild>
          <Link href="/create-gift">Create Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <div
          key={collection.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 truncate">{collection.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{collection.description}</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{formatCurrency(collection.currentAmount)} / {formatCurrency(collection.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(collection.currentAmount / collection.targetAmount) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">For</span>
                  <span className="font-medium">{collection.childName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`font-medium ${
                    collection.status === 'active' ? 'text-green-600' :
                    collection.status === 'completed' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button asChild className="flex-1">
                  <Link href={`/collections/${collection.id}`}>View Details</Link>
                </Button>
                {collection.status === 'active' && (
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/collections/${collection.id}/contribute`}>Contribute</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 