import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { mangopayService } from '@/lib/mangopay';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Best practice: validazione id
  if (!params.id || params.id === 'undefined') {
    return NextResponse.json({ error: 'Missing or invalid collection id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { amount, contributorName, contributorEmail, message, isPublic, donorRelation } = body;

    const supabase = createRouteHandlerClient({ cookies });

    // Verify authentication using getUser() instead of getSession()
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 1. Recupera la collezione e verifica lo stato
    const { data: collection, error: collectionError } = await supabase
      .from('gift_collections')
      .select('*, created_by_user_id')
      .eq('id', params.id)
      .single();

    if (collectionError) throw collectionError;
    if (collection.status !== 'active') {
      throw new Error('Collection is not active');
    }

    // 2. Verifica e aggiorna lo stato del wallet del genitore
    const { data: parentProfile, error: parentError } = await supabase
      .from('mangopay_users')
      .select('*')
      .eq('user_id', collection.created_by_user_id)
      .single();

    if (parentError && parentError.code !== 'PGRST116') {
      throw parentError;
    }

    if (!parentProfile || parentProfile.wallet_status === 'not_configured') {
      const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
      await supabase
        .from('mangopay_users')
        .upsert({
          user_id: collection.created_by_user_id,
          wallet_status: 'pending',
          wallet_setup_deadline: deadline.toISOString()
        });
    }

    // 3. Create contribution
    const { data: contribution, error } = await supabase
      .from('gift_contributions')
      .insert({
        collection_id: params.id,
        amount,
        contributor_name: contributorName,
        contributor_email: contributorEmail,
        message,
        is_public: isPublic,
        donor_relation: donorRelation,
        contributor_id: user?.id || null, // Use null instead of undefined for anonymous users
        payment_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Errore creazione contribuzione:', error);
      return NextResponse.json(
        { error: 'Errore durante la creazione della contribuzione.' },
        { status: 500 }
      );
    }

    // 4. Initialize MangoPay payment
    const payment = await mangopayService.createPayment({
      amount,
      userId: collection.created_by_user_id,
      contributionId: contribution.id,
      collectionId: params.id,
    });

    // 5. Update contribution with payment ID
    await supabase
      .from('gift_contributions')
      .update({ external_payment_id: payment.paymentId })
      .eq('id', contribution.id);

    // 6. Aggiorna l'importo totale della collezione
    await supabase
      .from('gift_collections')
      .update({ 
        total_amount: (collection.total_amount || 0) + amount,
        contributor_count: (collection.contributor_count || 0) + 1
      })
      .eq('id', params.id);

    return NextResponse.json({
      success: true,
      contribution,
      payment: {
        redirectUrl: payment.redirectUrl,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error('Error in contribution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 