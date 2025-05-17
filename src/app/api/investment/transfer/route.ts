import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mangopayService } from '@/lib/mangopay';
import { moneyfarmService } from '@/lib/moneyfarm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, collectionId, amount, moneyfarmAccountId, investmentPlanId } = body;

    // 1. Recupera l'utente e la collezione dal database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const { data: collection, error: collectionError } = await supabase
      .from('gift_collections')
      .select('*')
      .eq('id', collectionId)
      .single();

    if (collectionError) throw collectionError;

    // 2. Verifica che l'utente abbia completato il KYC
    if (user.kycStatus !== 'completed') {
      return NextResponse.json(
        { error: 'KYC verification required' },
        { status: 400 }
      );
    }

    // 3. Verifica che i fondi siano disponibili nel wallet MangoPay
    const walletBalance = await mangopayService.getEscrowWalletBalance(user.mangopayWalletId);
    if (walletBalance.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient funds' },
        { status: 400 }
      );
    }

    // 4. Crea l'ordine di investimento in Moneyfarm
    const investmentOrder = await moneyfarmService.createInvestmentOrder({
      accountId: moneyfarmAccountId,
      planId: investmentPlanId,
      amount
    });

    // 5. Crea il record di trasferimento
    const { data: transfer, error: transferError } = await supabase
      .from('transfer_requests')
      .insert({
        userId,
        collectionId,
        amount,
        status: 'pending',
        moneyfarmAccountId,
        moneyfarmOrderId: investmentOrder.orderId
      })
      .select()
      .single();

    if (transferError) throw transferError;

    // 6. Aggiorna lo stato della collezione
    const { error: updateError } = await supabase
      .from('gift_collections')
      .update({ status: 'completed' })
      .eq('id', collectionId);

    if (updateError) throw updateError;

    // 7. Invia la conferma di investimento
    // TODO: Implementare il servizio di notifiche
    // await notificationService.sendInvestmentConfirmation(user, amount, collection.childName);

    return NextResponse.json({
      success: true,
      transferId: transfer.id,
      orderId: investmentOrder.orderId
    });
  } catch (error) {
    console.error('Error processing investment transfer:', error);
    return NextResponse.json(
      { error: 'Error processing investment transfer' },
      { status: 500 }
    );
  }
}
