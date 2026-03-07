-- Simple Migration for Announcements and Events
-- Just copy this entire file and paste it into Supabase SQL Editor, then click Run

-- Update announcements table
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS content_en TEXT,
ADD COLUMN IF NOT EXISTS content_es TEXT;

-- Update events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_organization_id ON announcements(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_organization_id ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);

-- Done! Your tables are ready to use.
