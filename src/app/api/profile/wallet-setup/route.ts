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
    const { userId, kycData, bankData } = body;

    // 1. Recupera l'utente dal database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // 2. Se l'utente non ha un ID MangoPay, crealo
    if (!user.mangopayUserId) {
      const mangopayUser = await mangopayService.createNaturalUser({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthday: Math.floor(new Date(user.dateOfBirth).getTime() / 1000),
        nationality: 'IT',
        countryOfResidence: 'IT',
        address: bankData.address
      });

      // Aggiorna l'utente con l'ID MangoPay
      const { error: updateError } = await supabase
        .from('users')
        .update({ mangopayUserId: mangopayUser.Id })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    // 3. Crea il wallet MangoPay se non esiste
    if (!user.mangopayWalletId) {
      const wallet = await mangopayService.createWallet(
        user.mangopayUserId,
        `Wallet for ${user.firstName} ${user.lastName}`
      );

      // Aggiorna l'utente con l'ID del wallet
      const { error: updateError } = await supabase
        .from('users')
        .update({ mangopayWalletId: wallet.Id })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    // 4. Gestisci l'upload dei documenti KYC
    if (kycData) {
      const documentId = await mangopayService.uploadKYCDocument({
        userId: user.mangopayUserId,
        documentType: kycData.documentType,
        fileData: Buffer.from(kycData.fileData),
        fileType: kycData.fileType
      });

      // Aggiorna lo stato KYC dell'utente
      const { error: updateError } = await supabase
        .from('users')
        .update({ kycStatus: 'pending' })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    // 5. Configura il conto bancario
    if (bankData) {
      const bankAccount = await mangopayService.createBankAccount({
        userId: user.mangopayUserId,
        ownerName: `${user.firstName} ${user.lastName}`,
        iban: bankData.iban,
        bic: bankData.bic,
        address: bankData.address
      });

      // Salva i dettagli del conto bancario
      const { error: bankError } = await supabase
        .from('bank_profiles')
        .insert({
          userId,
          bankName: bankData.bankName,
          accountHolder: `${user.firstName} ${user.lastName}`,
          iban: bankData.iban,
          mangopayBankAccountId: bankAccount.Id,
          status: 'pending'
        });

      if (bankError) throw bankError;
    }

    // 6. Aggiorna lo stato del wallet
    const { error: updateError } = await supabase
      .from('users')
      .update({ walletStatus: 'active' })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 7. Avvia il processo di trasferimento per tutte le contribuzioni in escrow
    const { data: contributions, error: contributionsError } = await supabase
      .from('gift_contributions')
      .select('*')
      .eq('escrowStatus', 'in_escrow');

    if (contributionsError) throw contributionsError;

    let transferred = false;
    for (const contribution of contributions) {
      const { data: collection } = await supabase
        .from('gift_collections')
        .select('*')
        .eq('id', contribution.collectionId)
        .single();

      if (collection.userId === userId) {
        await mangopayService.transferFromEscrow({
          escrowWalletId: collection.escrowWalletId,
          parentWalletId: user.mangopayWalletId,
          amount: contribution.amount,
          platformUserId: process.env.MANGOPAY_PLATFORM_USER_ID!,
          parentUserId: user.mangopayUserId,
          collectionId: collection.id
        });

        // Aggiorna lo stato del contributo
        const { error: updateError } = await supabase
          .from('gift_contributions')
          .update({ escrowStatus: 'transferred' })
          .eq('id', contribution.id);

        if (updateError) throw updateError;
        transferred = true;
      }
    }

    // Invia notifica solo se almeno un trasferimento è stato fatto
    if (transferred && user.email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Futuro Tesoro <noreply@futuro-tesoro.it>",
          to: user.email,
          subject: "Fondi disponibili sul tuo wallet Futuro Tesoro",
          html: `<p>Ciao ${user.firstName || ""},<br>I fondi delle tue raccolte sono ora disponibili sul tuo wallet Futuro Tesoro.<br>Accedi alla piattaforma per visualizzare il saldo e procedere con l'investimento!</p>`
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting up wallet:', error);
    return NextResponse.json(
      { error: 'Error setting up wallet' },
      { status: 500 }
    );
  }
} 