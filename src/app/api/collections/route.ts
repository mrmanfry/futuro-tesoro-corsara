import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import type { CollectionFormData } from '@/types/collection';

export async function POST(request: Request) {
  try {
    // 1. Get request data
    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      occasion,
      customOccasion,
      theme,
      message,
      targetAmount,
      endDate,
      isPublic,
    } = body as CollectionFormData;

    // 2. Verify authentication
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        {
          error: 'Non autorizzato. Effettua il login per creare una raccolta.',
        },
        { status: 401 }
      );
    }

    // 3. Generate unique slug
    const baseSlug = `${firstName}-${lastName}-${occasion}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .substring(0, 30);

    const uniqueId = nanoid(8);
    const slug = `${baseSlug}-${uniqueId}`;

    // 4. Create record in gift_collections table
    const { data: collection, error } = await supabase
      .from('gift_collections')
      .insert({
        child_first_name: firstName,
        child_last_name: lastName,
        child_date_of_birth: dateOfBirth,
        occasion,
        custom_occasion: customOccasion,
        theme,
        message,
        target_amount: targetAmount || null,
        end_date: endDate || null,
        is_public: isPublic,
        created_by_user_id: session.user.id,
        status: 'active',
        slug,
        total_amount: 0,
        contributor_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Errore creazione collezione:', error);
      return NextResponse.json(
        { error: 'Errore durante la creazione della raccolta.' },
        { status: 500 }
      );
    }

    // 5. Return created collection with slug
    return NextResponse.json(
      {
        success: true,
        collection,
        slug,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Errore server:', error);
    return NextResponse.json(
      { error: 'Si è verificato un errore durante la richiesta.' },
      { status: 500 }
    );
  }
}
