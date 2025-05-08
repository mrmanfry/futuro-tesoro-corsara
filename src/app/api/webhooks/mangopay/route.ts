import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { mangopayService } from '@/lib/mangopay';

export async function POST(request: Request) {
  const body = await request.json();

  // Verifica la firma del webhook (in produzione)
  // const signature = request.headers.get('mangopay-signature');
  // if (!verifySignature(signature, body)) {
  //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  // }

  try {
    const { type, data } = body;

    // Gestisci solo gli eventi di pagamento
    if (type.startsWith('payment.')) {
      const paymentId = data.id;
      const paymentStatus = data.status;

      const supabase = createRouteHandlerClient({ cookies });

      // Aggiorna lo stato della contribuzione
      const { error } = await supabase
        .from('gift_contributions')
        .update({
          mangopay_payment_status: paymentStatus,
          // Se il pagamento è completato, aggiorna la data di completamento
          ...(paymentStatus === 'COMPLETED'
            ? { completed_at: new Date().toISOString() }
            : {}),
        })
        .eq('mangopay_session_id', paymentId);

      if (error) {
        console.error('Errore aggiornamento contribuzione:', error);
        return NextResponse.json({ success: false }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore webhook MangoPay:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
