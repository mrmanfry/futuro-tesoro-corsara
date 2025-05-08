import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { mangopayService } from '@/lib/mangopay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      collectionId,
      amount,
      donorName,
      donorEmail,
      donorRelation,
      message,
      isPublic,
    } = body;

    // Validazione base dei dati
    if (!collectionId || !amount || !donorName || !donorEmail) {
      return NextResponse.json(
        { error: 'Dati mancanti. Verifica tutti i campi obbligatori.' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verifica che la collezione esista ed è attiva
    const { data: collection, error: collectionError } = await supabase
      .from('gift_collections')
      .select('*')
      .eq('id', collectionId)
      .eq('status', 'active')
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { error: 'Raccolta non trovata o non attiva.' },
        { status: 404 }
      );
    }

    // URL di ritorno dopo il pagamento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUrl = `${baseUrl}/give/${collectionId}/thank-you`;

    // Crea sessione di pagamento con MangoPay
    const paymentSession = await mangopayService.createPaymentSession({
      contributorName: donorName,
      contributorEmail: donorEmail,
      amount,
      collectionId,
      redirectUrl,
    });

    // Crea un record parziale nella tabella gift_contributions
    const { data: contribution, error: contributionError } = await supabase
      .from('gift_contributions')
      .insert({
        collection_id: collectionId,
        amount,
        donor_name: donorName,
        donor_relation: donorRelation,
        message,
        is_public: isPublic,
        customer_email: donorEmail,
        // Campi MangoPay
        mangopay_session_id: paymentSession.paymentId,
        mangopay_payment_status: 'pending',
      })
      .select()
      .single();

    if (contributionError) {
      console.error('Errore creazione contribuzione:', contributionError);
      return NextResponse.json(
        { error: 'Errore durante la registrazione del contributo.' },
        { status: 500 }
      );
    }

    // Restituisci l'URL di reindirizzamento per il checkout
    return NextResponse.json({
      success: true,
      redirectUrl: paymentSession.redirectUrl,
      contributionId: contribution.id,
    });
  } catch (error) {
    console.error('Errore server:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la richiesta.' },
      { status: 500 }
    );
  }
}
