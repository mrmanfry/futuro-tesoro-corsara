import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mangopayService } from '@/lib/mangopay';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authenticity (implementation depends on MangoPay documentation)
    // This is a simplified version, in production you should verify the signature

    const body = await request.json();

    // MangoPay sends different types of events
    const eventType = body.EventType;
    const resourceId = body.ResourceId;

    if (!eventType || !resourceId) {
      throw new Error('Invalid webhook data');
    }

    // Handle different event types
    switch (eventType) {
      case 'PAYIN_NORMAL_SUCCEEDED':
        await handlePayInSucceeded(resourceId);
        break;

      case 'PAYIN_NORMAL_FAILED':
        await handlePayInFailed(resourceId);
        break;

      case 'KYC_SUCCEEDED':
        await handleKycSucceeded(resourceId);
        break;

      case 'KYC_FAILED':
        await handleKycFailed(resourceId);
        break;

      // Other events...
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

// Function to handle successful payment
async function handlePayInSucceeded(payInId: string) {
  // Find contribution associated with this payment
  const { data: contribution, error } = await supabaseAdmin
    .from('gift_contributions')
    .select('id, collection_id, amount')
    .eq('external_payment_id', payInId)
    .single();

  if (error) throw error;

  // Update contribution status
  await supabaseAdmin
    .from('gift_contributions')
    .update({ payment_status: 'completed' })
    .eq('id', contribution.id);

  // Get collection and owner
  const { data: collection, error: collectionError } = await supabaseAdmin
    .from('gift_collections')
    .select('user_id')
    .eq('id', contribution.collection_id)
    .single();

  if (collectionError) throw collectionError;

  // Check if owner already has an active wallet
  const { data: mangopayUser, error: mangopayUserError } = await supabaseAdmin
    .from('mangopay_users')
    .select('wallet_id, wallet_status')
    .eq('user_id', collection.user_id)
    .single();

  // If no wallet or not yet active, check if this is the first donation
  if (mangopayUserError || !mangopayUser || mangopayUser.wallet_status !== 'active') {
    // Check if this is the first donation for this collection
    const { count, error: countError } = await supabaseAdmin
      .from('gift_contributions')
      .select('id', { count: 'exact' })
      .eq('collection_id', contribution.collection_id)
      .eq('payment_status', 'completed');

    if (countError) throw countError;

    // If this is the first completed donation, create a notification for the creator
    if (count === 1) {
      // Check if notification already exists
      const { data: existingNotification, error: notificationError } = await supabaseAdmin
        .from('wallet_notifications')
        .select('id')
        .eq('collection_id', contribution.collection_id)
        .eq('user_id', collection.user_id)
        .single();

      // If no notification exists, create one
      if (notificationError) {
        await supabaseAdmin.from('wallet_notifications').insert([
          {
            user_id: collection.user_id,
            collection_id: contribution.collection_id,
            status: 'pending',
          },
        ]);

        // Here you could also send an email notification to the creator
        // using a service like SendGrid, Mailchimp, etc.
      }
    }
  } else if (mangopayUser.wallet_status === 'active') {
    // If wallet is already active, transfer funds directly
    try {
      await mangopayService.createTransfer({
        authorId: process.env.MANGOPAY_PLATFORM_USER_ID!,
        creditedWalletId: mangopayUser.wallet_id,
        debitedWalletId: process.env.MANGOPAY_PLATFORM_WALLET_ID!,
        amount: contribution.amount,
        fees: 0, // No fees for transfer
      });
    } catch (transferError) {
      console.error('Error transferring funds:', transferError);
      // Handle transfer error, maybe mark it in database for retry later
    }
  }
}

// Function to handle failed payment
async function handlePayInFailed(payInId: string) {
  await supabaseAdmin
    .from('gift_contributions')
    .update({ payment_status: 'failed' })
    .eq('external_payment_id', payInId);
}

// Function to handle successful KYC verification
async function handleKycSucceeded(documentId: string) {
  await supabaseAdmin
    .from('mangopay_users')
    .update({ kyc_status: 'verified' })
    .eq('kyc_document_id', documentId);

  // Notify user of successful verification
  // Implement your notification logic here
}

// Function to handle failed KYC verification
async function handleKycFailed(documentId: string) {
  await supabaseAdmin
    .from('mangopay_users')
    .update({ kyc_status: 'failed' })
    .eq('kyc_document_id', documentId);

  // Notify user of failed verification
  // Implement your notification logic here
} 