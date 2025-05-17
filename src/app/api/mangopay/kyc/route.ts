import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import MangoPay from 'mangopay2-nodejs-sdk';

const mangopay = new MangoPay({
  clientId: process.env.MANGOPAY_CLIENT_ID!,
  clientApiKey: process.env.MANGOPAY_CLIENT_PASSWORD!,
  baseUrl: process.env.MANGOPAY_API_URL,
});

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // LIGHT KYC: crea/aggiorna Natural User MangoPay
    if (body.lightKYC) {
      // Recupera l'email dell'utente
      const { data: profile } = await supabase
        .from('profiles')
        .select('mangopay_user_id, email')
        .eq('id', user.id)
        .single();

      const birthdayTimestamp = Math.floor(new Date(body.birthday).getTime() / 1000);
      const naturalUserPayload = {
        FirstName: body.firstName,
        LastName: body.lastName,
        Birthday: birthdayTimestamp,
        Nationality: body.nationality,
        CountryOfResidence: body.countryOfResidence,
        Email: profile?.email || user.email,
        TermsAndConditionsAccepted: true,
        UserCategory: 'OWNER',
        Address: {
          AddressLine1: body.address,
          City: body.city,
          PostalCode: body.postalCode,
          Country: body.country,
        },
      };

      let mangopayUser;
      if (profile?.mangopay_user_id) {
        // Aggiorna utente MangoPay esistente
        mangopayUser = await (mangopay.Users as any).updateNatural(profile.mangopay_user_id, naturalUserPayload);
      } else {
        // Crea nuovo utente MangoPay
        mangopayUser = await (mangopay.Users as any).createNatural(naturalUserPayload);
        // Salva l'id MangoPay su Supabase
        await supabase
          .from('profiles')
          .update({ mangopay_user_id: mangopayUser.Id })
          .eq('id', user.id);
      }

      return NextResponse.json({ success: true, mangopayUserId: mangopayUser.Id });
    }

    const { documentType, documentFile } = body;

    // Get user's MangoPay ID from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('mangopay_user_id')
      .eq('id', user.id)
      .single();

    if (!profile?.mangopay_user_id) {
      return NextResponse.json(
        { error: 'MangoPay user not found' },
        { status: 404 }
      );
    }

    // Create KYC document in MangoPay
    const kycDocument: any = await mangopay.Users.createKycDocument(
      profile.mangopay_user_id,
      {
        Type: (documentType === 'id_card' || documentType === 'passport') ? 'IDENTITY_PROOF' as any : 'DRIVING_LICENSE' as any,
      }
    );

    // Upload document file to MangoPay
    await mangopay.Users.createKycPage(
      profile.mangopay_user_id,
      kycDocument.Id,
      {
        File: documentFile,
      }
    );

    // Update KYC document status
    await mangopay.Users.updateKycDocument(
      profile.mangopay_user_id,
      kycDocument.Id,
      {}
    );

    // Update user profile in Supabase (solo riferimenti)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        kyc_status: 'pending',
        mangopay_kyc_id: kycDocument.Id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      kycDocumentId: kycDocument.Id,
    });
  } catch (error) {
    console.error('Error in KYC API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's MangoPay ID from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('mangopay_user_id')
      .eq('id', user.id)
      .single();

    if (!profile?.mangopay_user_id) {
      // Se non c'è ancora un utente MangoPay, serve light kyc
      return NextResponse.json({ status: 'light_required' });
    }

    // Recupera lo stato KYC da MangoPay
    const mangopayUser: any = await mangopay.Users.get(profile.mangopay_user_id);
    // KYCLevel: 'LIGHT', 'REGULAR', 'REQUIRED', 'REJECTED'
    let kycStatus: string;
    switch (mangopayUser.KYCLevel) {
      case 'LIGHT':
        kycStatus = 'light_required';
        break;
      case 'REGULAR':
        kycStatus = 'verified';
        break;
      case 'REQUIRED':
        kycStatus = 'full_required';
        break;
      case 'REJECTED':
        kycStatus = 'rejected';
        break;
      default:
        kycStatus = 'unknown';
    }

    return NextResponse.json({ status: kycStatus });
  } catch (error) {
    console.error('Error in KYC status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 