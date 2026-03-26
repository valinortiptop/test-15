-- migrations/001_rls_contact_messages.sql

-- Enable RLS on contact_messages table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the contact form to work without auth)
DROP POLICY IF EXISTS "allow_public_insert_contact_messages" ON contact_messages;
CREATE POLICY "allow_public_insert_contact_messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all messages (for admin use)
DROP POLICY IF EXISTS "allow_authenticated_select_contact_messages" ON contact_messages;
CREATE POLICY "allow_authenticated_select_contact_messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);