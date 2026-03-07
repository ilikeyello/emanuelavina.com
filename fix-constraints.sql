-- Fix NOT NULL constraints on old columns
-- Copy and paste this into Supabase SQL Editor and click Run

-- Remove NOT NULL constraint from old title column in announcements
ALTER TABLE announcements ALTER COLUMN title DROP NOT NULL;

-- Remove NOT NULL constraint from old content column in announcements  
ALTER TABLE announcements ALTER COLUMN content DROP NOT NULL;

-- Remove NOT NULL constraint from old title column in events
ALTER TABLE events ALTER COLUMN title DROP NOT NULL;

-- Remove NOT NULL constraint from old description column in events
ALTER TABLE events ALTER COLUMN description DROP NOT NULL;

-- Done! Now the old columns are optional and won't cause errors.
