export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  updated_at: Date;
  provider?: string;
  stripe_customer_id?: string;
  mangopay_wallet_id?: string;
  mangopay_user_id?: string;
}

export interface ChildProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  birthdate: Date;
  birthplace?: string;
  taxcode?: string;
  created_at: Date;
}

export interface GiftCollection {
  id: string;
  child_name: string;
  occasion?: string;
  message?: string;
  item?: string;
  theme?: string;
  target_amount?: number;
  is_flag: boolean;
  created_by_user_id: string;
  created_at: Date;
  status: 'active' | 'completed' | 'pending' | 'closed';
  is_deleted: boolean;
  child_birthdate?: Date;
}

export interface BankProfile {
  id: string;
  child_id: string;
  holder_full_name: string;
  holder_email: string;
  their_ref_reference?: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  holder_birthdate: Date;
  holder_taxcode?: string;
}

export interface GiftContribution {
  id: string;
  collection_id: string;
  contributor_id: string;
  amount: number;
  message?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  external_payment_id?: string;
  created_at: Date;
  updated_at: Date;
  contributor?: {
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
}

export interface TransferRequest {
  id: string;
  collection_id: string;
  created_at: Date;
  account_created: boolean;
  user_id: string;
  collection_slug: string;
  child_id: string;
}
