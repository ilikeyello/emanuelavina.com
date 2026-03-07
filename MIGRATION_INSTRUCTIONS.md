# Database Migration Instructions

Follow these steps to update your Supabase database tables for the new rich text editor system.

## Prerequisites
- Access to your Supabase Dashboard
- Your project URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

## Step-by-Step Migration

### 1. Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New query**

### 2. Run the Migration Script
1. Open the `supabase-migrations.sql` file in this directory
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)

### 3. What the Migration Does

#### For `announcements` table:
- Adds `title_en` column (TEXT) - stores title in English
- Adds `title_es` column (TEXT) - stores title in Spanish  
- Adds `content_en` column (TEXT) - stores rich HTML content in English
- Adds `content_es` column (TEXT) - stores rich HTML content in Spanish
- Migrates existing data from old `title` and `content` columns
- Creates index on `organization_id` for performance

#### For `events` table:
- Adds `title_en` column (TEXT) - stores title in English
- Adds `title_es` column (TEXT) - stores title in Spanish
- Adds `description_en` column (TEXT) - stores rich HTML description in English
- Adds `description_es` column (TEXT) - stores rich HTML description in Spanish
- Migrates existing data from old `title` and `description` columns
- Creates indexes on `organization_id` and `event_date` for performance

### 4. Verify Migration Success

After running the migration, verify the changes:

```sql
-- Check announcements table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'announcements' 
ORDER BY column_name;

-- Check events table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY column_name;
```

You should see the new `_en` and `_es` columns for both tables.

### 5. Test with Sample Data (Optional)

Uncomment the sample data section at the bottom of `supabase-migrations.sql` and replace `'your_org_id_here'` with your actual organization ID to insert test records.

## Important Notes

### About Old Columns
The migration script does NOT drop the old `title`, `content`, and `description` columns by default. This is for safety. If you want to remove them after confirming everything works:

```sql
-- ONLY run these after confirming the migration worked!
ALTER TABLE announcements DROP COLUMN IF EXISTS title;
ALTER TABLE announcements DROP COLUMN IF EXISTS content;

ALTER TABLE events DROP COLUMN IF EXISTS title;
ALTER TABLE events DROP COLUMN IF EXISTS description;
```

### How the System Works
- Admin writes content in **one language** (any language they want)
- The API stores the same content in **both** `_en` and `_es` columns
- This maintains compatibility with the church site that may read from either column
- Organization ID separates content between different churches

## Troubleshooting

### Error: "column already exists"
This is fine - it means the column was already there. The script uses `IF NOT EXISTS` checks to prevent errors.

### Error: "relation does not exist"
Make sure you're running the script in the correct Supabase project and that the `announcements` and `events` tables exist.

### Data not migrating
Check if your existing tables use different column names. You may need to adjust the UPDATE statements in the migration script.

## Next Steps

After migration:
1. Test creating an announcement in the admin dashboard
2. Test creating an event in the admin dashboard
3. Test uploading an image in the rich text editor
4. Verify content appears on the church website

## Support

If you encounter issues, check:
1. Supabase logs in the Dashboard
2. Browser console for API errors
3. Network tab to see API request/response details
