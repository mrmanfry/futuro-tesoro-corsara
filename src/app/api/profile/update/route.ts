import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await request.json();
  const { full_name, avatar_url } = body;

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
} 