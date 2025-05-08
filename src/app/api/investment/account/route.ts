import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { moneyfarmService } from '@/lib/moneyfarm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      childId,
      holderFullName,
      holderEmail,
      holderBirthdate,
      holderTaxcode,
    } = body;

    // Validazione base dei dati
    if (!childId || !holderFullName || !holderEmail || !holderBirthdate) {
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

    // Verifica che l'utente sia il genitore del bambino
    const { data: childProfile, error: childError } = await supabase
      .from('child_profiles')
      .select('*')
      .eq('id', childId)
      .eq('user_id', session.user.id)
      .single();

    if (childError || !childProfile) {
      return NextResponse.json(
        { error: 'Profilo bambino non trovato o non autorizzato.' },
        { status: 404 }
      );
    }

    // Crea account Moneyfarm
    const moneyfarmAccount = await moneyfarmService.createAccount({
      userId: session.user.id,
      childId,
      holderFullName,
      holderEmail,
      holderBirthdate,
      holderTaxcode,
    });

    // Registra l'account nel database
    const { data: bankProfile, error: bankError } = await supabase
      .from('bank_profiles')
      .insert({
        child_id: childId,
        user_id: session.user.id,
        holder_full_name: holderFullName,
        holder_email: holderEmail,
        holder_birthdate: holderBirthdate,
        holder_taxcode: holderTaxcode,
        their_ref_reference: moneyfarmAccount.accountId,
      })
      .select()
      .single();

    if (bankError) {
      console.error('Errore creazione profilo bancario:', bankError);
      return NextResponse.json(
        { error: 'Errore durante la registrazione del profilo bancario.' },
        { status: 500 }
      );
    }

    // Restituisci i dati dell'account
    return NextResponse.json({
      success: true,
      account: {
        id: bankProfile.id,
        accountId: moneyfarmAccount.accountId,
        status: moneyfarmAccount.status,
        kycUrl: moneyfarmAccount.kycUrl,
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
