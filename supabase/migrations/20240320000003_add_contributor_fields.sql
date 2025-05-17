-- Add contributor fields to gift_contributions table
ALTER TABLE gift_contributions
ADD COLUMN IF NOT EXISTS contributor_name TEXT,
ADD COLUMN IF NOT EXISTS contributor_email TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS donor_relation TEXT;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_gift_contributions_contributor_name ON gift_contributions(contributor_name);
CREATE INDEX IF NOT EXISTS idx_gift_contributions_contributor_email ON gift_contributions(contributor_email); 