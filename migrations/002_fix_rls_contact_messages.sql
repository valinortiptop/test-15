-- migrations/002_fix_rls_contact_messages.sql

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_insert_contact_messages" ON contact_messages;
CREATE POLICY "allow_public_insert_contact_messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "allow_authenticated_select_contact_messages" ON contact_messages;
CREATE POLICY "allow_authenticated_select_contact_messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);