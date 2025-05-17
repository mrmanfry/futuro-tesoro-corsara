import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mangopayService } from '@/lib/mangopay';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { collectionId, amount, contributorName, contributorEmail, message, isPublic, donorRelation } = body;

    // 1. Recupera la collezione e verifica lo stato
    const { data: collection, error: collectionError } = await supabase
      .from('gift_collections')
      .select('*, created_by_user_id')
      .eq('id', collectionId)
      .single();

    if (collectionError) throw collectionError;
    if (collection.status !== 'active') {
      throw new Error('Collection is not active');
    }

    // --- AGGIUNTA: Verifica e aggiorna lo stato del wallet del genitore ---
    const { data: parentProfile, error: parentError } = await supabase
      .from('mangopay_users')
      .select('*')
      .eq('user_id', collection.created_by_user_id)
      .single();

    if (parentError && parentError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw parentError;
    }

    if (!parentProfile || parentProfile.wallet_status === 'not_configured') {
      const deadline = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // +5 giorni
      await supabase
        .from('mangopay_users')
        .upsert({
          user_id: collection.created_by_user_id,
          wallet_status: 'pending',
          wallet_setup_deadline: deadline.toISOString()
        });
    }
    // --- FINE AGGIUNTA ---

    // 2. Crea il contributo nel database
    const { data: contribution, error: contributionError } = await supabase
      .from('gift_contributions')
      .insert({
        collection_id: collectionId,
        amount,
        contributor_name: contributorName,
        contributor_email: contributorEmail,
        message,
        is_public: isPublic,
        donor_relation: donorRelation,
        contributor_id: null, // Anonymous contribution
        payment_status: 'pending'
      })
      .select()
      .single();

    if (contributionError) throw contributionError;

    // 3. Crea il pagamento MangoPay
    const payment = await mangopayService.createPayment({
      amount,
      userId: collection.created_by_user_id,
      contributionId: contribution.id,
      collectionId,
    });

    // 4. Aggiorna il contributo con l'ID della transazione
    const { error: updateError } = await supabase
      .from('gift_contributions')
      .update({ external_payment_id: payment.paymentId })
      .eq('id', contribution.id);

    if (updateError) throw updateError;

    // 5. Aggiorna l'importo totale della collezione
    const { error: collectionUpdateError } = await supabase
      .from('gift_collections')
      .update({ 
        total_amount: (collection.total_amount || 0) + amount,
        contributor_count: (collection.contributor_count || 0) + 1
      })
      .eq('id', collectionId);

    if (collectionUpdateError) throw collectionUpdateError;

    return NextResponse.json({
      success: true,
      contribution,
      paymentUrl: payment.redirectUrl
    });
  } catch (error) {
    console.error('Error creating contribution:', error);
    return NextResponse.json(
      { error: 'Error creating contribution' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contributionId = searchParams.get('id');
    if (!contributionId) {
      return NextResponse.json({ success: false, error: 'Missing contribution id' }, { status: 400 });
    }
    const { data: contribution, error } = await supabase
      .from('gift_contributions')
      .select('id, amount, message, payment_status, contributor_name, contributor_email, is_public, donor_relation')
      .eq('id', contributionId)
      .single();
    if (error || !contribution) {
      return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, contribution });
  } catch (error) {
    console.error('Error fetching contribution status:', error);
    return NextResponse.json({ success: false, error: 'Error fetching contribution status' }, { status: 500 });
  }
}
