import MangoPay from 'mangopay2-nodejs-sdk';

const mangopayClient = new MangoPay({
  clientId: process.env.NEXT_PUBLIC_MANGOPAY_CLIENT_ID!,
  clientApiKey: process.env.MANGOPAY_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_MANGOPAY_API_URL,
});

export const mangopayService = {
  // Create a natural user
  async createNaturalUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    birthday: number;
    nationality: string;
    countryOfResidence: string;
    address?: {
      AddressLine1: string;
      City: string;
      PostalCode: string;
      Region: string;
      Country: string;
    };
  }) {
    try {
      const user = {
        FirstName: userData.firstName,
        LastName: userData.lastName,
        Email: userData.email,
        Birthday: userData.birthday,
        Nationality: userData.nationality,
        CountryOfResidence: userData.countryOfResidence,
        ...(userData.address && { Address: userData.address })
      };
      
      return await (mangopayClient.Users as any).createNatural(user);
    } catch (error) {
      console.error('Error creating natural user:', error);
      throw error;
    }
  },

  // Create a wallet for a user
  async createWallet(userId: string, description: string, currency = 'EUR') {
    try {
      const wallet = {
        Owners: [userId] as [string],
        Description: description,
        Currency: currency as 'EUR',
      };
      
      return await mangopayClient.Wallets.create(wallet);
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  },

  // Create a payment
  async createPayment({
    amount,
    currency = 'EUR',
    userId,
    contributionId,
    collectionId,
  }: {
    amount: number;
    currency?: string;
    userId: string;
    contributionId: string;
    collectionId: string;
  }) {
    // MOCK: restituisci un oggetto finto per sviluppo senza sandbox MangoPay
    return {
      paymentId: 'mock-payment-id-' + contributionId,
      redirectUrl: `/give/${collectionId}/thank-you?contributionId=${contributionId}`,
      status: 'MOCKED',
    };
  },

  // Get payment status
  async getPaymentStatus(paymentId: string) {
    try {
      const payment = await mangopayClient.PayIns.get(paymentId);
      return {
        status: payment.Status,
        resultCode: payment.ResultCode,
        resultMessage: payment.ResultMessage,
      };
    } catch (error) {
      console.error('MangoPay payment status error:', error);
      throw new Error('Errore durante il recupero dello stato del pagamento');
    }
  },

  // Create a transfer between wallets
  async createTransfer({
    authorId,
    creditedWalletId,
    debitedWalletId,
    amount,
    fees = 0,
    currency = 'EUR',
  }: {
    authorId: string;
    creditedWalletId: string;
    debitedWalletId: string;
    amount: number;
    fees?: number;
    currency?: string;
  }) {
    try {
      const transfer = {
        AuthorId: authorId,
        CreditedWalletId: creditedWalletId,
        DebitedWalletId: debitedWalletId,
        DebitedFunds: {
          Currency: currency as 'EUR',
          Amount: amount * 100, // Convert to cents
        },
        Fees: {
          Currency: currency as 'EUR',
          Amount: fees * 100, // Convert to cents
        }
      };

      return await mangopayClient.Transfers.create(transfer);
    } catch (error) {
      console.error('Error creating transfer:', error);
      throw error;
    }
  },

  // Get user KYC status
  async getUserKYCStatus(userId: string) {
    try {
      const user = await mangopayClient.Users.get(userId);
      return {
        status: user.KYCLevel,
      };
    } catch (error) {
      console.error('Error getting user KYC status:', error);
      throw error;
    }
  },

  // Create an escrow wallet for a collection
  async createEscrowWallet(platformUserId: string, collectionId: string) {
    try {
      const wallet = {
        Owners: [platformUserId] as [string],
        Description: `Escrow wallet for collection ${collectionId}`,
        Currency: 'EUR' as 'EUR',
        Tag: `escrow_${collectionId}`
      };
      
      return await mangopayClient.Wallets.create(wallet);
    } catch (error) {
      console.error('Error creating escrow wallet:', error);
      throw error;
    }
  },

  // Transfer funds from escrow to parent wallet
  async transferFromEscrow({
    escrowWalletId,
    parentWalletId,
    amount,
    platformUserId,
    parentUserId,
    collectionId
  }: {
    escrowWalletId: string;
    parentWalletId: string;
    amount: number;
    platformUserId: string;
    parentUserId: string;
    collectionId: string;
  }) {
    try {
      const transfer = {
        AuthorId: platformUserId,
        CreditedUserId: parentUserId,
        CreditedWalletId: parentWalletId,
        DebitedWalletId: escrowWalletId,
        DebitedFunds: {
          Currency: 'EUR' as 'EUR',
          Amount: amount * 100, // Convert to cents
        },
        Fees: {
          Currency: 'EUR' as 'EUR',
          Amount: 0,
        },
        Tag: `escrow_transfer_${collectionId}`
      };

      return await mangopayClient.Transfers.create(transfer);
    } catch (error) {
      console.error('Error transferring from escrow:', error);
      throw error;
    }
  },

  // Get escrow wallet balance
  async getEscrowWalletBalance(walletId: string) {
    try {
      const wallet = await mangopayClient.Wallets.get(walletId);
      return {
        balance: wallet.Balance.Amount / 100, // Convert from cents
        currency: wallet.Balance.Currency
      };
    } catch (error) {
      console.error('Error getting escrow wallet balance:', error);
      throw error;
    }
  },

  // Upload KYC document
  async uploadKYCDocument({
    userId,
    documentType,
    fileData,
    fileType
  }: {
    userId: string;
    documentType: 'IDENTITY_PROOF' | 'PASSPORT' | 'DRIVING_LICENSE';
    fileData: string; // base64
    fileType: string;
  }) {
    try {
      // Crea il documento KYC
      const document = await (mangopayClient.Users as any).createKycDocument(userId, {
        Type: documentType,
        Status: 'CREATED'
      });

      // Carica il file
      await (mangopayClient.Users as any).createKycPage(userId, document.Id, {
        File: fileData,
        FileType: fileType
      });

      // Aggiorna lo stato del documento
      await (mangopayClient.Users as any).updateKycDocument(userId, document.Id, {
        Status: 'VALIDATION_ASKED'
      });

      return document;
    } catch (error) {
      console.error('Error uploading KYC document:', error);
      throw error;
    }
  },

  // Get KYC status
  async getKYCStatus(userId: string, documentId: string) {
    try {
      const document = await (mangopayClient.Users as any).getKycDocument(userId, documentId);
      return {
        status: document.Status.toLowerCase(),
        type: document.Type,
        created: document.CreationDate,
        lastUpdated: document.LastUpdateDate
      };
    } catch (error) {
      console.error('Error getting KYC status:', error);
      throw error;
    }
  },

  // Create a bank account for a user
  async createBankAccount({
    userId,
    ownerName,
    iban,
    bic,
    address
  }: {
    userId: string;
    ownerName: string;
    iban: string;
    bic: string;
    address: {
      AddressLine1: string;
      City: string;
      PostalCode: string;
      Region: string;
      Country: string;
    };
  }) {
    try {
      const bankAccount = {
        UserId: userId,
        Type: 'IBAN',
        OwnerName: ownerName,
        OwnerAddress: address,
        IBAN: iban,
        BIC: bic
      };

      return await (mangopayClient.Users as any).createBankAccount(userId, bankAccount);
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  }
};
