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
    const { title, description, targetAmount, childName, childDob, userId } = body;

    // 1. Crea la collezione nel database
    const { data: collection, error: collectionError } = await supabase
      .from('gift_collections')
      .insert({
        title,
        description,
        targetAmount,
        childName,
        childDob,
        userId,
        status: 'active',
        currentAmount: 0
      })
      .select()
      .single();

    if (collectionError) throw collectionError;

    // 2. Crea il wallet di escrow per la collezione
    const platformUserId = process.env.MANGOPAY_PLATFORM_USER_ID!;
    const escrowWallet = await mangopayService.createEscrowWallet(
      platformUserId,
      collection.id
    );

    // 3. Aggiorna la collezione con l'ID del wallet di escrow
    const { error: updateError } = await supabase
      .from('gift_collections')
      .update({ escrowWalletId: escrowWallet.Id })
      .eq('id', collection.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Error creating collection' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let query = supabase
      .from('gift_collections')
      .select('*');

    if (userId) {
      query = query.eq('userId', userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: collections, error } = await query;

    if (error) throw error;

    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Error fetching collections' },
      { status: 500 }
    );
  }
}
