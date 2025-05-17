-- Add KYC fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS kyc_status text DEFAULT 'required',
ADD COLUMN IF NOT EXISTS kyc_data jsonb,
ADD COLUMN IF NOT EXISTS mangopay_kyc_id text,
ADD COLUMN IF NOT EXISTS kyc_required_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS kyc_completed_at timestamp with time zone;

-- Create index on kyc_status for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_kyc_status ON profiles(kyc_status);

-- Add check constraint to ensure valid kyc_status values
ALTER TABLE profiles
ADD CONSTRAINT valid_kyc_status
CHECK (kyc_status IN ('required', 'pending', 'verified', 'rejected'));

-- Add trigger to update kyc_required_at when status changes to 'required'
CREATE OR REPLACE FUNCTION update_kyc_required_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.kyc_status = 'required' AND (OLD.kyc_status IS NULL OR OLD.kyc_status != 'required') THEN
    NEW.kyc_required_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_kyc_required_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_kyc_required_at();

-- Add trigger to update kyc_completed_at when status changes to 'verified'
CREATE OR REPLACE FUNCTION update_kyc_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.kyc_status = 'verified' AND (OLD.kyc_status IS NULL OR OLD.kyc_status != 'verified') THEN
    NEW.kyc_completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_kyc_completed_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_kyc_completed_at(); 