import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { mangopayService } from '@/lib/mangopay';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { collectionId, userData } = body;

    // 1. Verify collection ownership
    const { data: collection, error: collectionError } = await supabaseAdmin
      .from('gift_collections')
      .select('*')
      .eq('id', collectionId)
      .eq('user_id', userId)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { success: false, message: 'Collection not found or unauthorized' },
        { status: 403 }
      );
    }

    // 2. Create MangoPay user
    const mangopayUser = await mangopayService.createNaturalUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: session.user.email!,
      birthday: userData.birthday,
      nationality: userData.nationality,
      countryOfResidence: userData.countryOfResidence,
      address: userData.address,
    });

    // 3. Create wallet for user
    const wallet = await mangopayService.createWallet(
      mangopayUser.Id,
      `Wallet per la collezione ${collection.title}`,
      'EUR'
    );

    // 4. Save information in database
    const { data: mangopayUserData, error: mangopayUserError } = await supabaseAdmin
      .from('mangopay_users')
      .insert([
        {
          user_id: userId,
          mangopay_user_id: mangopayUser.Id,
          wallet_id: wallet.Id,
          wallet_status: 'active',
          kyc_status: 'created',
        },
      ])
      .select()
      .single();

    if (mangopayUserError) throw mangopayUserError;

    // 5. Update notification status
    await supabaseAdmin
      .from('wallet_notifications')
      .update({ status: 'completed' })
      .eq('collection_id', collectionId)
      .eq('user_id', userId);

    // 6. Transfer all collected funds to user's wallet
    // Get all completed contributions
    const { data: contributions, error: contributionsError } = await supabaseAdmin
      .from('gift_contributions')
      .select('*')
      .eq('collection_id', collectionId)
      .eq('payment_status', 'completed');

    if (contributionsError) throw contributionsError;

    // If there are contributions, transfer funds
    if (contributions && contributions.length > 0) {
      // Calculate total amount to transfer
      const totalAmount = contributions.reduce(
        (total, contribution) => total + contribution.amount,
        0
      );

      // Transfer funds from platform wallet to user's wallet
      await mangopayService.createTransfer({
        authorId: process.env.MANGOPAY_PLATFORM_USER_ID!,
        creditedWalletId: wallet.Id,
        debitedWalletId: process.env.MANGOPAY_PLATFORM_WALLET_ID!,
        amount: totalAmount,
        fees: 0, // No fees for transfer
      });
    }

    return NextResponse.json({
      success: true,
      userId: mangopayUser.Id,
      walletId: wallet.Id,
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
} 