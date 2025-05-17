import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const collectionId = searchParams.get('collectionId');

    let query = supabaseAdmin
      .from('wallet_notifications')
      .select(`
        *,
        collection:collection_id (
          id,
          title,
          user_id
        )
      `)
      .eq('user_id', session.user.id);

    if (status) {
      query = query.eq('status', status);
    }

    if (collectionId) {
      query = query.eq('collection_id', collectionId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching wallet notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { collectionId } = body;

    // Verify collection ownership
    const { data: collection, error: collectionError } = await supabaseAdmin
      .from('gift_collections')
      .select('id, user_id')
      .eq('id', collectionId)
      .eq('user_id', session.user.id)
      .single();

    if (collectionError || !collection) {
      return NextResponse.json(
        { success: false, message: 'Collection not found or unauthorized' },
        { status: 403 }
      );
    }

    // Check if notification already exists
    const { data: existingNotification, error: checkError } = await supabaseAdmin
      .from('wallet_notifications')
      .select('id')
      .eq('collection_id', collectionId)
      .eq('user_id', session.user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingNotification) {
      return NextResponse.json(
        { success: false, message: 'Notification already exists' },
        { status: 400 }
      );
    }

    // Create notification
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('wallet_notifications')
      .insert([
        {
          user_id: session.user.id,
          collection_id: collectionId,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (notificationError) throw notificationError;

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating wallet notification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, status } = body;

    // Update notification
    const { data: notification, error: notificationError } = await supabaseAdmin
      .from('wallet_notifications')
      .update({ status })
      .eq('id', notificationId)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (notificationError) throw notificationError;

    return NextResponse.json({ success: true, data: notification });
  } catch (error) {
    console.error('Error updating wallet notification:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 