-- Create mangopay_users table
CREATE TABLE IF NOT EXISTS mangopay_users (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  mangopay_user_id TEXT NOT NULL,
  wallet_id TEXT,
  wallet_status TEXT DEFAULT 'pending',
  kyc_status TEXT DEFAULT 'not_started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallet_notifications table
CREATE TABLE IF NOT EXISTS wallet_notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  collection_id INTEGER REFERENCES gift_collections(id) NOT NULL,
  notification_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending'
);

-- Create function to set wallet deadline
CREATE OR REPLACE FUNCTION set_wallet_deadline()
RETURNS TRIGGER AS $$
BEGIN
  NEW.deadline = NEW.notification_sent_at + INTERVAL '5 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for wallet deadline
CREATE TRIGGER wallet_notification_deadline_trigger
BEFORE INSERT ON wallet_notifications
FOR EACH ROW EXECUTE PROCEDURE set_wallet_deadline();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_mangopay_users_user_id ON mangopay_users(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_notifications_user_id ON wallet_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_notifications_collection_id ON wallet_notifications(collection_id);
CREATE INDEX IF NOT EXISTS idx_wallet_notifications_status ON wallet_notifications(status);

-- Add RLS policies
ALTER TABLE mangopay_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_notifications ENABLE ROW LEVEL SECURITY;

-- Policy for mangopay_users
CREATE POLICY "Users can view their own mangopay data"
  ON mangopay_users FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for wallet_notifications
CREATE POLICY "Users can view their own wallet notifications"
  ON wallet_notifications FOR SELECT
  USING (auth.uid() = user_id); 