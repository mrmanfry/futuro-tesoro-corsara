'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WalletNotification {
  id: number;
  collection_id: number;
  collection: {
    id: number;
    title: string;
  };
  deadline: string;
  status: string;
}

export default function WalletSetupNotification() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<WalletNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/wallet-notifications?status=pending');
        const data = await response.json();

        if (data.success) {
          setNotifications(data.data);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        toast.error('Errore nel caricamento delle notifiche');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();

    // Polling per aggiornamenti ogni 60 secondi
    const interval = setInterval(loadNotifications, 60000);

    return () => clearInterval(interval);
  }, [user]);

  if (loading) return null;
  if (notifications.length === 0) return null;

  return (
    <div className="mb-6">
      {notifications.map((notification) => {
        const daysLeft = Math.ceil(
          (new Date(notification.deadline).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={notification.id}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
          >
            <div className="flex items-start">
              <div className="text-yellow-400 mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Configura il tuo wallet</p>
                <p className="text-sm mt-1">
                  Hai ricevuto contributi per la tua raccolta "
                  {notification.collection.title}". Configura il tuo wallet per
                  poter ricevere i fondi. Hai{' '}
                  <strong>{daysLeft} giorni</strong> per completare la
                  configurazione.
                </p>
                <div className="mt-3">
                  <Link
                    href={`/app/wallet-setup/${notification.collection_id}`}
                    className="bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700"
                  >
                    Configura ora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 