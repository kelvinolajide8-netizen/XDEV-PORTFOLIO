/*
# Portfolio Schema - Projects, Tools, and Languages

1. New Tables
- `projects`: stores portfolio projects with title, description, thumbnail, live demo link, github link, featured flag, created_at
- `project_images`: additional gallery images per project (beyond the thumbnail)
- `project_languages`: languages/technologies tagged per project — used to auto-calculate technical skills
- `tools`: tools & technologies shown in the skills section, managed via admin

2. Security
- Single-tenant app (admin page is accessible without auth per user request)
- RLS enabled on all tables with anon+authenticated full CRUD (intentionally public/shared data)

3. Notes
- Technical skills percentages are computed automatically from the frequency of languages across projects
- Projects have an `is_featured` boolean and `sort_order` to control which 6 appear on the home page
- The home page shows the 6 most recent featured projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail_url text,
  live_demo_url text,
  github_url text,
  is_featured boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_project_images" ON project_images;
CREATE POLICY "anon_select_project_images" ON project_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_project_images" ON project_images;
CREATE POLICY "anon_insert_project_images" ON project_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_project_images" ON project_images;
CREATE POLICY "anon_update_project_images" ON project_images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_project_images" ON project_images;
CREATE POLICY "anon_delete_project_images" ON project_images FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS project_languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  language text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_project_languages" ON project_languages;
CREATE POLICY "anon_select_project_languages" ON project_languages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_project_languages" ON project_languages;
CREATE POLICY "anon_insert_project_languages" ON project_languages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_project_languages" ON project_languages;
CREATE POLICY "anon_delete_project_languages" ON project_languages FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tools" ON tools;
CREATE POLICY "anon_select_tools" ON tools FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tools" ON tools;
CREATE POLICY "anon_insert_tools" ON tools FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tools" ON tools;
CREATE POLICY "anon_update_tools" ON tools FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tools" ON tools;
CREATE POLICY "anon_delete_tools" ON tools FOR DELETE
  TO anon, authenticated USING (true);

-- Seed initial tools
INSERT INTO tools (name) VALUES
  ('Git'), ('Docker'), ('Figma'), ('AWS'),
  ('MongoDB'), ('PostgreSQL'), ('Tailwind'), ('TypeScript')
ON CONFLICT DO NOTHING;

-- Seed initial projects
INSERT INTO projects (title, description, thumbnail_url, live_demo_url, github_url, is_featured, sort_order)
VALUES
  ('E-Commerce Platform', 'A full-stack shopping platform with real-time inventory, payment processing, and admin dashboard.', NULL, '#', '#', true, 1),
  ('Analytics Dashboard', 'Real-time data visualization dashboard with customizable widgets and automated reporting.', NULL, '#', '#', true, 2),
  ('Chat Application', 'Real-time messaging app with video calls, file sharing, and end-to-end encryption.', NULL, '#', '#', true, 3),
  ('AI Task Manager', 'Smart task management with AI-powered prioritization and natural language input.', NULL, '#', '#', true, 4),
  ('Eco Tracker', 'Carbon footprint tracking app with gamification and community challenges.', NULL, '#', '#', true, 5),
  ('Music Streamer', 'Music streaming platform with playlist management and social features.', NULL, '#', '#', true, 6)
ON CONFLICT DO NOTHING;

-- Seed languages for projects
INSERT INTO project_languages (project_id, language)
SELECT p.id, lang FROM projects p
JOIN (VALUES
  ('E-Commerce Platform', 'React'), ('E-Commerce Platform', 'Node.js'), ('E-Commerce Platform', 'Stripe'),
  ('Analytics Dashboard', 'Vue.js'), ('Analytics Dashboard', 'D3.js'), ('Analytics Dashboard', 'Firebase'),
  ('Chat Application', 'Socket.io'), ('Chat Application', 'WebRTC'), ('Chat Application', 'Redis'),
  ('AI Task Manager', 'Python'), ('AI Task Manager', 'OpenAI'), ('AI Task Manager', 'FastAPI'),
  ('Eco Tracker', 'React Native'), ('Eco Tracker', 'Node.js'), ('Eco Tracker', 'MongoDB'),
  ('Music Streamer', 'Next.js'), ('Music Streamer', 'Prisma'), ('Music Streamer', 'PostgreSQL')
) AS seed(title, lang) ON seed.title = p.title
WHERE NOT EXISTS (SELECT 1 FROM project_languages pl WHERE pl.project_id = p.id AND pl.language = seed.lang);
