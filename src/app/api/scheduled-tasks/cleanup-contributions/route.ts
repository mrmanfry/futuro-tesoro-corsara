import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Trova tutti i contributi pending creati da più di 1 ora
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: pendingContributions, error } = await supabase
      .from('gift_contributions')
      .select('*')
      .eq('payment_status', 'pending')
      .lt('created_at', oneHourAgo);

    if (error) throw error;
    if (!pendingContributions || pendingContributions.length === 0) {
      return NextResponse.json({ message: 'No expired pending contributions found.' });
    }

    // Aggiorna lo stato a expired
    const ids = pendingContributions.map((c: any) => c.id);
    const { error: updateError } = await supabase
      .from('gift_contributions')
      .update({ payment_status: 'expired' })
      .in('id', ids);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, expired: ids.length });
  } catch (err) {
    console.error('Error in cleanup-contributions:', err);
    return NextResponse.json({ error: 'Error in cleanup-contributions' }, { status: 500 });
  }
} 