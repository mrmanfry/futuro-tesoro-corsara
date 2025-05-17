import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock, Wallet } from "lucide-react";
import Link from 'next/link';

interface WalletStatusProps {
  walletStatus: 'not_configured' | 'pending' | 'active';
  walletSetupDeadline?: string;
  escrowAmount: number;
  availableAmount: number;
}

export default function WalletStatus({ 
  walletStatus, 
  walletSetupDeadline, 
  escrowAmount, 
  availableAmount 
}: WalletStatusProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (walletStatus === 'pending' && walletSetupDeadline) {
      const deadline = new Date(walletSetupDeadline);
      const now = new Date();
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);

      // Show alerts based on days remaining
      if (diffDays <= 0) {
        setShowAlert(true);
        setAlertMessage('La scadenza per la configurazione del wallet è superata. I fondi verranno rimborsati.');
      } else if (diffDays <= 1) {
        setShowAlert(true);
        setAlertMessage('Manca 1 giorno alla scadenza per la configurazione del wallet!');
      } else if (diffDays <= 3) {
        setShowAlert(true);
        setAlertMessage(`Mancano ${diffDays} giorni alla scadenza per la configurazione del wallet!`);
      } else if (diffDays <= 5) {
        setShowAlert(true);
        setAlertMessage(`Mancano ${diffDays} giorni alla scadenza per la configurazione del wallet!`);
      } else {
        setShowAlert(false);
      }
    }
  }, [walletStatus, walletSetupDeadline]);

  const getStatusColor = () => {
    switch (walletStatus) {
      case 'active':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (walletStatus) {
      case 'active':
        return 'Attivo';
      case 'pending':
        return 'In attesa';
      default:
        return 'Non configurato';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Stato Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAlert && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attenzione</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Stato:</span>
            <span className={`text-sm font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {walletStatus === 'pending' && daysRemaining !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Giorni rimanenti:</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
                <Clock className="h-4 w-4" />
                {daysRemaining}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fondi in escrow:</span>
            <span className="text-sm font-semibold">
              €{escrowAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fondi disponibili:</span>
            <span className="text-sm font-semibold">
              €{availableAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {(walletStatus === 'not_configured' || walletStatus === 'pending') && (
          <div className="pt-4">
            <Link
              href="/wallet/setup"
              className="inline-flex items-center rounded-md bg-ftb-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ftb-blue-700 focus:outline-none focus:ring-2 focus:ring-ftb-blue-500 focus:ring-offset-2"
            >
              Completa configurazione wallet
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 