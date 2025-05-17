import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mangopayService } from '@/lib/mangopay';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Verifica la firma del webhook
    const signature = req.headers.get('x-mangopay-signature');
    if (!signature || !verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const eventType = body.EventType;
    const resourceId = body.ResourceId;

    switch (eventType) {
      case 'PAYIN_NORMAL_SUCCEEDED': {
        // Recupera il contributo associato al pagamento
        const { data: contribution, error: contributionError } = await supabase
          .from('gift_contributions')
          .select('*')
          .eq('transactionId', resourceId)
          .single();

        if (contributionError) throw contributionError;

        // IDEMPOTENZA: se già completed, non fare nulla
        if (contribution.payment_status === 'completed') break;

        // Aggiorna lo stato del contributo
        const { error: updateError } = await supabase
          .from('gift_contributions')
          .update({ escrowStatus: 'in_escrow', payment_status: 'completed' })
          .eq('id', contribution.id);

        if (updateError) throw updateError;
        break;
      }

      case 'PAYIN_NORMAL_FAILED': {
        // Recupera il contributo associato al pagamento
        const { data: contribution, error: contributionError } = await supabase
          .from('gift_contributions')
          .select('*')
          .eq('transactionId', resourceId)
          .single();

        if (contributionError) throw contributionError;

        // IDEMPOTENZA: se già failed, non fare nulla
        if (contribution.payment_status === 'failed') break;

        // Aggiorna lo stato del contributo
        const { error: updateError } = await supabase
          .from('gift_contributions')
          .update({ escrowStatus: 'refunded', payment_status: 'failed' })
          .eq('id', contribution.id);

        if (updateError) throw updateError;
        break;
      }

      case 'TRANSFER_NORMAL_SUCCEEDED': {
        // Recupera il contributo associato al trasferimento
        const { data: contribution, error: contributionError } = await supabase
          .from('gift_contributions')
          .select('*')
          .eq('transactionId', resourceId)
          .single();

        if (contributionError) throw contributionError;

        // Aggiorna lo stato del contributo
        const { error: updateError } = await supabase
          .from('gift_contributions')
          .update({ escrowStatus: 'transferred' })
          .eq('id', contribution.id);

        if (updateError) throw updateError;
        break;
      }

      case 'KYC_SUCCEEDED': {
        // Recupera l'utente associato al documento KYC
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('mangopay_kyc_id', resourceId)
          .single();

        if (profileError) throw profileError;

        // Aggiorna lo stato KYC dell'utente
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            kyc_status: 'verified',
            kyc_completed_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        // Crea una notifica per l'utente
        await supabase
          .from('kyc_notifications')
          .insert({
            user_id: profile.id,
            type: 'verified',
            status: 'pending'
          });

        break;
      }

      case 'KYC_FAILED': {
        // Recupera l'utente associato al documento KYC
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('mangopay_kyc_id', resourceId)
          .single();

        if (profileError) throw profileError;

        // Aggiorna lo stato KYC dell'utente
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ kyc_status: 'rejected' })
          .eq('id', profile.id);

        if (updateError) throw updateError;

        // Crea una notifica per l'utente
        await supabase
          .from('kyc_notifications')
          .insert({
            user_id: profile.id,
            type: 'rejected',
            status: 'pending'
          });

        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing MangoPay webhook:', error);
    // Notifica admin in caso di errore critico (placeholder: puoi integrare con Slack, email, ecc.)
    try {
      // Esempio: invio email admin (integra con la tua funzione sendEmail se disponibile)
      if (process.env.ADMIN_EMAIL) {
        await fetch(process.env.NOTIFY_ADMIN_URL || '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: process.env.ADMIN_EMAIL,
            subject: 'Errore critico MangoPay Webhook',
            message: `Errore: ${error?.message || error}`,
            data: { error, time: new Date().toISOString() }
          })
        });
      }
    } catch (notifyErr) {
      console.error('Errore invio notifica admin:', notifyErr);
    }
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

function verifyWebhookSignature(payload: any, signature: string): boolean {
  // Implementazione reale: MangoPay usa HMAC SHA256 del body raw, chiave = webhook secret
  try {
    const secret = process.env.MANGOPAY_WEBHOOK_SECRET;
    if (!secret) return false;
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const computed = crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
    return computed === signature;
  } catch (e) {
    console.error('Errore verifica firma webhook:', e);
    return false;
  }
}
