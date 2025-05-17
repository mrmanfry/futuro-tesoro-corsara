import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // 1. Recupera tutti i profili con wallet pending e deadline impostata
    const { data: pendingProfiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_status', 'pending')
      .not('wallet_setup_deadline', 'is', null);

    if (error) throw error;
    if (!pendingProfiles || pendingProfiles.length === 0) {
      return NextResponse.json({ message: 'No pending profiles found.' });
    }

    const now = new Date();
    const results: any[] = [];

    for (const profile of pendingProfiles) {
      const deadline = new Date(profile.wallet_setup_deadline);
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Reminder a 5, 3, 1 giorni
      if ([5, 3, 1].includes(daysLeft)) {
        if (profile.email) {
          await resend.emails.send({
            from: 'Futuro Tesoro <noreply@futuro-tesoro.it>',
            to: profile.email,
            subject: `Reminder: Completa la configurazione del wallet (${daysLeft} giorni rimasti)` ,
            html: `<p>Ciao ${profile.full_name || ''},<br>Hai ancora <b>${daysLeft} giorni</b> per completare la configurazione del wallet e ricevere i fondi delle donazioni.<br>Accedi subito alla tua area personale!</p>`
          });
          results.push({ user: profile.id, email: profile.email, reminder: daysLeft });
        }
      }

      // Scadenza superata
      if (daysLeft < 0) {
        // Qui puoi implementare refund automatico o estensione deadline
        // Per ora logghiamo l'azione
        results.push({ user: profile.id, action: 'expired', email: profile.email });
        // Esempio: puoi aggiornare lo stato o inviare una mail diversa
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error('Error in check-escrow:', err);
    return NextResponse.json({ error: 'Error in check-escrow' }, { status: 500 });
  }
} 