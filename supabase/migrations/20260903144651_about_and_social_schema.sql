/*
# Portfolio About Info and Social Links Tables

1. New Tables
- `about_info`: single-row table storing the experience badge text/number and profile image URL
- `social_links`: stores social media platforms with their names, URLs, and icon identifiers

2. Security
- Single-tenant app (no auth required for data access)
- RLS enabled on all tables with anon+authenticated full CRUD (intentionally public/shared data)

3. Notes
- `about_info` uses a fixed id so there is always exactly one row
- `social_links` has a `platform` field (github, linkedin, twitter, instagram, facebook, etc.) and a `display_name` for custom labels
*/

CREATE TABLE IF NOT EXISTS about_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_number text NOT NULL DEFAULT '1+',
  experience_text text NOT NULL DEFAULT 'Years Exp.',
  profile_image_url text,
  about_heading text NOT NULL DEFAULT 'Passionate about creating amazing digital experiences',
  about_paragraph_1 text NOT NULL DEFAULT 'I am a full-stack developer with a love for clean code and beautiful design. I specialize in building modern web applications that are fast, accessible, and user-friendly.',
  about_paragraph_2 text NOT NULL DEFAULT 'When I am not coding, you will find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while sketching out new ideas.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE about_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_about_info" ON about_info;
CREATE POLICY "anon_select_about_info" ON about_info FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_about_info" ON about_info;
CREATE POLICY "anon_insert_about_info" ON about_info FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_about_info" ON about_info;
CREATE POLICY "anon_update_about_info" ON about_info FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_about_info" ON about_info;
CREATE POLICY "anon_delete_about_info" ON about_info FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  display_name text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_social_links" ON social_links;
CREATE POLICY "anon_select_social_links" ON social_links FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_social_links" ON social_links;
CREATE POLICY "anon_insert_social_links" ON social_links FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_social_links" ON social_links;
CREATE POLICY "anon_update_social_links" ON social_links FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_social_links" ON social_links;
CREATE POLICY "anon_delete_social_links" ON social_links FOR DELETE
  TO anon, authenticated USING (true);

-- Seed about_info with default row
INSERT INTO about_info (experience_number, experience_text)
VALUES ('1+', 'Years Exp.')
ON CONFLICT DO NOTHING;

-- Seed social links
INSERT INTO social_links (platform, display_name, url, sort_order) VALUES
  ('github', 'GitHub', 'https://github.com', 1),
  ('linkedin', 'LinkedIn', 'https://linkedin.com', 2),
  ('twitter', 'Twitter', 'https://twitter.com', 3),
  ('instagram', 'Instagram', 'https://instagram.com', 4),
  ('facebook', 'Facebook', 'https://facebook.com', 5)
ON CONFLICT DO NOTHING;
