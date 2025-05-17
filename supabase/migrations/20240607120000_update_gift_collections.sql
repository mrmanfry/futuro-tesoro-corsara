-- Aggiorna o crea la tabella gift_collections per il nuovo flusso multi-step

CREATE TABLE IF NOT EXISTS gift_collections (
  id SERIAL PRIMARY KEY,
  child_name TEXT NOT NULL,
  child_birthdate DATE NOT NULL,
  theme JSONB NOT NULL,
  message TEXT NOT NULL,
  photo_url TEXT,
  co_creators TEXT[] DEFAULT ARRAY[]::TEXT[],
  slug TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  created_by_user_id UUID REFERENCES auth.users(id) NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0,
  contributor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aggiungi colonne mancanti se la tabella esiste già
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='child_name') THEN
    ALTER TABLE gift_collections ADD COLUMN child_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='child_birthdate') THEN
    ALTER TABLE gift_collections ADD COLUMN child_birthdate DATE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='theme') THEN
    ALTER TABLE gift_collections ADD COLUMN theme JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='message') THEN
    ALTER TABLE gift_collections ADD COLUMN message TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='photo_url') THEN
    ALTER TABLE gift_collections ADD COLUMN photo_url TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='co_creators') THEN
    ALTER TABLE gift_collections ADD COLUMN co_creators TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='slug') THEN
    ALTER TABLE gift_collections ADD COLUMN slug TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='status') THEN
    ALTER TABLE gift_collections ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='created_by_user_id') THEN
    ALTER TABLE gift_collections ADD COLUMN created_by_user_id UUID REFERENCES auth.users(id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='total_amount') THEN
    ALTER TABLE gift_collections ADD COLUMN total_amount DECIMAL(10,2) DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='contributor_count') THEN
    ALTER TABLE gift_collections ADD COLUMN contributor_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='created_at') THEN
    ALTER TABLE gift_collections ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gift_collections' AND column_name='updated_at') THEN
    ALTER TABLE gift_collections ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_gift_collections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_gift_collections_updated_at ON gift_collections;
CREATE TRIGGER update_gift_collections_updated_at
  BEFORE UPDATE ON gift_collections
  FOR EACH ROW
  EXECUTE PROCEDURE update_gift_collections_updated_at(); 