import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button/index';
import { formatCurrency } from '@/lib/utils/index';

interface Contribution {
  id: string;
  amount: number;
  contributorName: string;
  message?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

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
  contributions: Contribution[];
}

interface CollectionDetailsProps {
  collection: Collection;
  onInvest?: () => void;
}

export function CollectionDetails({ collection, onInvest }: CollectionDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInvest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onInvest?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (collection.currentAmount / collection.targetAmount) * 100;
  const remainingAmount = collection.targetAmount - collection.currentAmount;
  const completedContributions = collection.contributions.filter(c => c.status === 'completed');
  const pendingContributions = collection.contributions.filter(c => c.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
        <p className="text-muted-foreground">{collection.description}</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{formatCurrency(collection.currentAmount)} / {formatCurrency(collection.targetAmount)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-semibold">{formatCurrency(remainingAmount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Contributors</p>
              <p className="font-semibold">{completedContributions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Child Info */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Child Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-semibold">{collection.childName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date of Birth</p>
            <p className="font-semibold">{new Date(collection.childDob).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {collection.status === 'active' && (
          <>
            <Button asChild className="flex-1">
              <Link href={`/collections/${collection.id}/contribute`}>Contribute</Link>
            </Button>
            {collection.currentAmount > 0 && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleInvest}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Invest Funds'}
              </Button>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {/* Contributions */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>
        {collection.contributions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No contributions yet</p>
        ) : (
          <div className="space-y-4">
            {completedContributions.map((contribution) => (
              <div key={contribution.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">{contribution.contributorName}</p>
                  {contribution.message && (
                    <p className="text-muted-foreground text-sm mt-1">{contribution.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(contribution.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(contribution.amount)}</p>
              </div>
            ))}
          </div>
        )}

        {pendingContributions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Pending Contributions</h3>
            <div className="space-y-4">
              {pendingContributions.map((contribution) => (
                <div key={contribution.id} className="flex justify-between items-start border-b pb-4 last:border-0 opacity-70">
                  <div>
                    <p className="font-medium">{contribution.contributorName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(contribution.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(contribution.amount)}</p>
                    <p className="text-xs text-yellow-600 mt-1">Pending</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 