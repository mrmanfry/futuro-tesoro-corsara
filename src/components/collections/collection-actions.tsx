'use client';

import { useState } from 'react';
import { Share, Copy, Check, QrCode, Lock, CreditCard } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GiftCollection } from '@/types/database';

interface CollectionActionsProps {
  collection: GiftCollection;
}

export function CollectionActions({ collection }: CollectionActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Genera l'URL di condivisione
  const shareUrl = `${window.location.origin}/give/${collection.id}`;

  // Gestisce la copia dell'URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copiato!', {
        description: 'Il link è stato copiato negli appunti.',
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Errore', {
        description: 'Non è stato possibile copiare il link.',
      });
    }
  };

  // Gestisce la condivisione nativa
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Raccolta per ${collection.child_name}`,
          text:
            collection.message ||
            `Una raccolta regalo per ${collection.child_name}`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Errore durante la condivisione:', err);
        }
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Condividi</CardTitle>
          <CardDescription>Invia il link ad amici e parenti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                title="Copia link"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Condividi
              </Button>

              <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <QrCode className="mr-2 h-4 w-4" />
                    Codice QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Codice QR</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center py-4">
                    <div className="rounded bg-white p-4">
                      {/* Qui andrebbe integrato un componente QR Code, usando ad esempio qrcode.react */}
                      <div className="flex h-48 w-48 items-center justify-center border">
                        QR Code Placeholder
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Inquadra questo codice QR per accedere alla raccolta
                  </p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Azioni</CardTitle>
          <CardDescription>Gestisci la tua raccolta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {collection.status === 'active' && (
              <Button className="w-full" variant="outline" onClick={() => {}}>
                <Lock className="mr-2 h-4 w-4" />
                Chiudi Raccolta
              </Button>
            )}

            <Button className="w-full" variant="default" onClick={() => {}}>
              <CreditCard className="mr-2 h-4 w-4" />
              Investi Fondi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
