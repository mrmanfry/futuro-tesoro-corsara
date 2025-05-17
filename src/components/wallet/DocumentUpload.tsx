'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DocumentUploadProps {
  onUploadComplete: (urls: { front: string; back: string }) => void;
  onError: (error: Error) => void;
}

export function DocumentUpload({ onUploadComplete, onError }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'front') {
        setFrontPreview(reader.result as string);
      } else {
        setBackPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non autenticato');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${side}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      if (side === 'front') {
        onUploadComplete({ front: publicUrl, back: backPreview || '' });
      } else {
        onUploadComplete({ front: frontPreview || '', back: publicUrl });
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Errore durante l\'upload'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">Fronte Documento</h4>
              {frontPreview && (
                <img
                  src={frontPreview}
                  alt="Fronte documento"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => document.getElementById('front-upload')?.click()}
              >
                {isUploading ? 'Upload in corso...' : 'Carica Fronte'}
              </Button>
              <input
                id="front-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'front')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium">Retro Documento</h4>
              {backPreview && (
                <img
                  src={backPreview}
                  alt="Retro documento"
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => document.getElementById('back-upload')?.click()}
              >
                {isUploading ? 'Upload in corso...' : 'Carica Retro'}
              </Button>
              <input
                id="back-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'back')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 