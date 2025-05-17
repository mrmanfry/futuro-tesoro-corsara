import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  console.log('Check Session - All cookies:', allCookies.map(c => ({name: c.name, value: c.value.substring(0, 10) + '...'})));
  
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    hasSession: !!data.session,
    userId: data.session?.user?.id || null,
    email: data.session?.user?.email || null,
    cookieCount: allCookies.length,
    hasSbAuthCookie: allCookies.some(c => c.name.startsWith('sb-'))
  });
} 