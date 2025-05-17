'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';

interface FormData {
  firstName: string;
  lastName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  nationality: string;
  countryOfResidence: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
}

export default function WalletSetupPage() {
  const { collectionId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [collection, setCollection] = useState<any>(null);
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    nationality: 'IT',
    countryOfResidence: 'IT',
    address: '',
    city: '',
    postalCode: '',
    region: '',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Load collection
        const collectionRes = await fetch(`/api/collections/${collectionId}`);
        const collectionData = await collectionRes.json();

        // Load notification
        const notificationRes = await fetch(
          `/api/wallet-notifications?collectionId=${collectionId}`
        );
        const notificationData = await notificationRes.json();

        if (collectionData.success && notificationData.success) {
          setCollection(collectionData.data);
          setNotification(notificationData.data[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, collectionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare birthday in required format
      const birthday = new Date(
        parseInt(formData.birthYear),
        parseInt(formData.birthMonth) - 1,
        parseInt(formData.birthDay)
      ).getTime();

      // Send data to create user and wallet
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId,
          userData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthday,
            nationality: formData.nationality,
            countryOfResidence: formData.countryOfResidence,
            address: {
              AddressLine1: formData.address,
              City: formData.city,
              PostalCode: formData.postalCode,
              Region: formData.region,
              Country: formData.countryOfResidence,
            },
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Wallet creato con successo');
        router.push(`/app/wallet-setup/${collectionId}/success`);
      } else {
        throw new Error(result.message || 'Errore nella creazione del wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast.error('Si è verificato un errore: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Caricamento in corso...</div>;
  }

  // Calculate deadline
  const deadline = notification ? new Date(notification.deadline) : null;
  const daysLeft = deadline
    ? Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Configura il tuo wallet per ricevere i fondi
      </h1>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800">
          Hai ricevuto la tua prima donazione per la raccolta "{collection?.title}"!
          Per poter ricevere i fondi, devi configurare il tuo wallet entro{' '}
          <strong>{daysLeft} giorni</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cognome</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data di nascita</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="birthDay"
              placeholder="Giorno"
              min="1"
              max="31"
              value={formData.birthDay}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="birthMonth"
              placeholder="Mese"
              min="1"
              max="12"
              value={formData.birthMonth}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="birthYear"
              placeholder="Anno"
              min="1900"
              max="2005"
              value={formData.birthYear}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Indirizzo</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Città</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CAP</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Provincia</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Creazione in corso...' : 'Crea wallet'}
        </button>
      </form>
    </div>
  );
} 