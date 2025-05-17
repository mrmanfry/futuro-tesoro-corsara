-- Create gift_contributions table
CREATE TABLE IF NOT EXISTS gift_contributions (
  id SERIAL PRIMARY KEY,
  collection_id INTEGER REFERENCES gift_collections(id) NOT NULL,
  contributor_id UUID REFERENCES auth.users(id) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  payment_status TEXT DEFAULT 'pending',
  external_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create investment_accounts table
CREATE TABLE IF NOT EXISTS investment_accounts (
  id SERIAL PRIMARY KEY,
  child_id INTEGER REFERENCES child_profiles(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  account_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  investment_amount DECIMAL(10,2),
  investment_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  reference_id TEXT,
  reference_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_gift_contributions_collection_id ON gift_contributions(collection_id);
CREATE INDEX IF NOT EXISTS idx_gift_contributions_contributor_id ON gift_contributions(contributor_id);
CREATE INDEX IF NOT EXISTS idx_gift_contributions_payment_status ON gift_contributions(payment_status);
CREATE INDEX IF NOT EXISTS idx_investment_accounts_child_id ON investment_accounts(child_id);
CREATE INDEX IF NOT EXISTS idx_investment_accounts_user_id ON investment_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Enable RLS
ALTER TABLE gift_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gift_contributions
CREATE POLICY "Users can view their own contributions"
  ON gift_contributions FOR SELECT
  USING (auth.uid() = contributor_id);

CREATE POLICY "Users can view contributions to their collections"
  ON gift_contributions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gift_collections
      WHERE gift_collections.id = gift_contributions.collection_id
      AND gift_collections.created_by_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create contributions"
  ON gift_contributions FOR INSERT
  WITH CHECK (auth.uid() = contributor_id);

-- RLS Policies for investment_accounts
CREATE POLICY "Users can view their own investment accounts"
  ON investment_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create investment accounts"
  ON investment_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investment accounts"
  ON investment_accounts FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gift_contributions_updated_at
  BEFORE UPDATE ON gift_contributions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_investment_accounts_updated_at
  BEFORE UPDATE ON investment_accounts
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 