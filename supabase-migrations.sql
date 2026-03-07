-- ============================================
-- SUPABASE MIGRATION SCRIPT
-- Updates announcements and events tables for rich text content
-- ============================================

-- ============================================
-- 1. UPDATE ANNOUNCEMENTS TABLE
-- ============================================

-- Check if columns exist and add them if they don't
-- Note: Run these one at a time in Supabase SQL Editor

-- Add title_en column if it doesn't exist (for bilingual support in database)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='announcements' AND column_name='title_en') THEN
    ALTER TABLE announcements ADD COLUMN title_en TEXT;
  END IF;
END $$;

-- Add title_es column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='announcements' AND column_name='title_es') THEN
    ALTER TABLE announcements ADD COLUMN title_es TEXT;
  END IF;
END $$;

-- Add content_en column if it doesn't exist (stores HTML from rich text editor)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='announcements' AND column_name='content_en') THEN
    ALTER TABLE announcements ADD COLUMN content_en TEXT;
  END IF;
END $$;

-- Add content_es column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='announcements' AND column_name='content_es') THEN
    ALTER TABLE announcements ADD COLUMN content_es TEXT;
  END IF;
END $$;

-- Migrate existing data from old columns to new columns (if you have old data)
-- This copies title -> title_en and title_es, content -> content_en and content_es
UPDATE announcements 
SET 
  title_en = COALESCE(title_en, title),
  title_es = COALESCE(title_es, title),
  content_en = COALESCE(content_en, content),
  content_es = COALESCE(content_es, content)
WHERE title_en IS NULL OR title_es IS NULL OR content_en IS NULL OR content_es IS NULL;

-- Optional: Drop old columns if you're sure you don't need them
-- ONLY RUN THESE IF YOU'RE CERTAIN THE MIGRATION WORKED
-- ALTER TABLE announcements DROP COLUMN IF EXISTS title;
-- ALTER TABLE announcements DROP COLUMN IF EXISTS content;


-- ============================================
-- 2. UPDATE EVENTS TABLE
-- ============================================

-- Add title_en column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='title_en') THEN
    ALTER TABLE events ADD COLUMN title_en TEXT;
  END IF;
END $$;

-- Add title_es column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='title_es') THEN
    ALTER TABLE events ADD COLUMN title_es TEXT;
  END IF;
END $$;

-- Add description_en column if it doesn't exist (stores HTML from rich text editor)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='description_en') THEN
    ALTER TABLE events ADD COLUMN description_en TEXT;
  END IF;
END $$;

-- Add description_es column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='events' AND column_name='description_es') THEN
    ALTER TABLE events ADD COLUMN description_es TEXT;
  END IF;
END $$;

-- Migrate existing data from old columns to new columns (if you have old data)
-- This copies title -> title_en and title_es, description -> description_en and description_es
UPDATE events 
SET 
  title_en = COALESCE(title_en, title),
  title_es = COALESCE(title_es, title),
  description_en = COALESCE(description_en, description),
  description_es = COALESCE(description_es, description)
WHERE title_en IS NULL OR title_es IS NULL OR description_en IS NULL OR description_es IS NULL;

-- Optional: Drop old columns if you're sure you don't need them
-- ONLY RUN THESE IF YOU'RE CERTAIN THE MIGRATION WORKED
-- ALTER TABLE events DROP COLUMN IF EXISTS title;
-- ALTER TABLE events DROP COLUMN IF EXISTS description;


-- ============================================
-- 3. VERIFY REQUIRED COLUMNS EXIST
-- ============================================

-- Verify announcements table has all required columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'announcements' 
  AND column_name IN ('id', 'organization_id', 'title_en', 'title_es', 'content_en', 'content_es', 'priority', 'image_url', 'expires_at', 'created_at', 'created_by')
ORDER BY column_name;

-- Verify events table has all required columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
  AND column_name IN ('id', 'organization_id', 'title_en', 'title_es', 'description_en', 'description_es', 'event_date', 'location', 'max_attendees', 'created_at', 'created_by')
ORDER BY column_name;


-- ============================================
-- 4. ENSURE INDEXES EXIST FOR PERFORMANCE
-- ============================================

-- Index on organization_id for announcements (if not exists)
CREATE INDEX IF NOT EXISTS idx_announcements_organization_id 
ON announcements(organization_id);

-- Index on organization_id for events (if not exists)
CREATE INDEX IF NOT EXISTS idx_events_organization_id 
ON events(organization_id);

-- Index on event_date for events (if not exists)
CREATE INDEX IF NOT EXISTS idx_events_event_date 
ON events(event_date);


-- ============================================
-- 5. SAMPLE DATA TO TEST (OPTIONAL)
-- ============================================

-- Uncomment to insert test data
/*
-- Test announcement with rich text
INSERT INTO announcements (
  organization_id, 
  title_en, 
  title_es, 
  content_en, 
  content_es, 
  priority, 
  created_by
) VALUES (
  'your_org_id_here',
  'Test Announcement',
  'Test Announcement',
  '<h2>Welcome!</h2><p>This is a <strong>test</strong> announcement with <em>rich text</em>.</p>',
  '<h2>Welcome!</h2><p>This is a <strong>test</strong> announcement with <em>rich text</em>.</p>',
  'normal',
  'admin'
);

-- Test event with rich text
INSERT INTO events (
  organization_id,
  title_en,
  title_es,
  description_en,
  description_es,
  event_date,
  location,
  max_attendees,
  created_by
) VALUES (
  'your_org_id_here',
  'Sunday Service',
  'Sunday Service',
  '<h3>Join us for worship!</h3><p>We will have <strong>special music</strong> and a message from Pastor John.</p>',
  '<h3>Join us for worship!</h3><p>We will have <strong>special music</strong> and a message from Pastor John.</p>',
  NOW() + INTERVAL '7 days',
  'Main Sanctuary',
  200,
  'admin'
);
*/
