-- migrations/002_generated_images.sql

CREATE TABLE IF NOT EXISTS generated_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  image_base64 text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_public_insert_images" ON generated_images;
CREATE POLICY "allow_public_insert_images" ON generated_images
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "allow_public_select_images" ON generated_images;
CREATE POLICY "allow_public_select_images" ON generated_images
  FOR SELECT
  TO public
  USING (true);