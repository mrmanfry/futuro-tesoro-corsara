import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return Response.json({ error: 'Nessun file inviato' }, { status: 400 });
  }

  // Genera un nome file unico
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Carica su Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  // Ottieni la URL pubblica
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return Response.json({ url: data.publicUrl });
} 