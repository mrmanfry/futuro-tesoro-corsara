-- Update RLS policies for gift_collections
CREATE POLICY "Users can view their own collections"
  ON gift_collections FOR SELECT
  USING (auth.uid() = created_by_user_id);

CREATE POLICY "Users can view public collections"
  ON gift_collections FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create collections"
  ON gift_collections FOR INSERT
  WITH CHECK (auth.uid() = created_by_user_id);

CREATE POLICY "Users can update their own collections"
  ON gift_collections FOR UPDATE
  USING (auth.uid() = created_by_user_id);

CREATE POLICY "Users can delete their own collections"
  ON gift_collections FOR DELETE
  USING (auth.uid() = created_by_user_id);

-- Update RLS policies for child_profiles
CREATE POLICY "Users can view their own child profiles"
  ON child_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create child profiles"
  ON child_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own child profiles"
  ON child_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own child profiles"
  ON child_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Update RLS policies for bank_profiles
CREATE POLICY "Users can view their own bank profiles"
  ON bank_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bank profiles"
  ON bank_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank profiles"
  ON bank_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank profiles"
  ON bank_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Update RLS policies for mangopay_users
CREATE POLICY "Users can update their own mangopay data"
  ON mangopay_users FOR UPDATE
  USING (auth.uid() = user_id);

-- Update RLS policies for wallet_notifications
CREATE POLICY "Users can update their own wallet notifications"
  ON wallet_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallet notifications"
  ON wallet_notifications FOR DELETE
  USING (auth.uid() = user_id); 