import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { moneyfarmService } from '@/lib/moneyfarm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { collectionId, bankProfileId } = body;

    // Validazione base dei dati
    if (!collectionId || !bankProfileId) {
      return NextResponse.json(
        { error: 'Dati mancanti. Verifica tutti i campi obbligatori.' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verifica autenticazione
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Utente non autenticato.' },
        { status: 401 }
      );
    }

    // Verifica che l'utente sia il proprietario della collezione
    const { data: collection, error: collectionError } = await supabase
      .from('gift_collections')
      .select('*')
      .eq('id', collectionId)
      .eq('created_by_user_id', session.user.id)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { error: 'Collezione non trovata o non autorizzata.' },
        { status: 404 }
      );
    }

    // Verifica che la collezione non sia già stata trasferita
    const { data: existingTransfers, error: transferError } = await supabase
      .from('transfer_requests')
      .select('*')
      .eq('collection_id', collectionId)
      .eq('account_created', true);

    if (existingTransfers && existingTransfers.length > 0) {
      return NextResponse.json(
        { error: 'Questa collezione è già stata trasferita.' },
        { status: 400 }
      );
    }

    // Ottieni il profilo bancario
    const { data: bankProfile, error: bankError } = await supabase
      .from('bank_profiles')
      .select('*')
      .eq('id', bankProfileId)
      .eq('user_id', session.user.id)
      .single();

    if (bankError || !bankProfile) {
      return NextResponse.json(
        { error: 'Profilo bancario non trovato o non autorizzato.' },
        { status: 404 }
      );
    }

    // Calcola l'importo totale delle contribuzioni
    const { data: contributions, error: contributionsError } = await supabase
      .from('gift_contributions')
      .select('amount')
      .eq('collection_id', collectionId)
      .eq('mangopay_payment_status', 'COMPLETED');

    if (contributionsError) {
      return NextResponse.json(
        { error: 'Errore nel recupero delle contribuzioni.' },
        { status: 500 }
      );
    }

    const totalAmount =
      contributions?.reduce(
        (sum, contribution) => sum + contribution.amount,
        0
      ) || 0;

    if (totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Nessun fondo disponibile per il trasferimento.' },
        { status: 400 }
      );
    }

    // Esegui il trasferimento a Moneyfarm
    const transfer = await moneyfarmService.transferFunds({
      sourceWalletId: session.user.id, // In produzione, qui ci sarebbe l'ID del wallet MangoPay
      destinationAccountId: bankProfile.their_ref_reference,
      amount: totalAmount,
      reference: `Collection-${collectionId}`,
    });

    // Registra il trasferimento nel database
    const { data: transferRequest, error: transferRequestError } =
      await supabase
        .from('transfer_requests')
        .insert({
          collection_id: collectionId,
          child_id: bankProfile.child_id,
          user_id: session.user.id,
          account_created: true,
          collection_slug: collection.id, // In produzione, qui ci sarebbe lo slug reale
        })
        .select()
        .single();

    if (transferRequestError) {
      console.error(
        'Errore registrazione trasferimento:',
        transferRequestError
      );
      return NextResponse.json(
        { error: 'Errore durante la registrazione del trasferimento.' },
        { status: 500 }
      );
    }

    // Aggiorna lo stato della collezione
    await supabase
      .from('gift_collections')
      .update({ status: 'completed' })
      .eq('id', collectionId);

    // Restituisci i dati del trasferimento
    return NextResponse.json({
      success: true,
      transfer: {
        id: transferRequest.id,
        amount: totalAmount,
        status: transfer.status,
        estimatedCompletionDate: transfer.estimatedCompletionDate,
      },
    });
  } catch (error) {
    console.error('Errore server:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la richiesta.' },
      { status: 500 }
    );
  }
}
