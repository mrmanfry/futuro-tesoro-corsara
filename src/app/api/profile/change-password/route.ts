import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const { password } = body;
  if (!password || password.length < 6) {
    return Response.json({ error: 'La password deve essere di almeno 6 caratteri.' }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
} 