-- Fix RLS policies to use organization-based authentication
-- Drop existing policies

-- Church content policies
DROP POLICY IF EXISTS "Users can view content for their church" ON church_content;
DROP POLICY IF EXISTS "Users can insert content for their church" ON church_content;
DROP POLICY IF EXISTS "Users can update content for their church" ON church_content;
DROP POLICY IF EXISTS "Users can delete content for their church" ON church_content;

-- Tithe.ly config policies
DROP POLICY IF EXISTS "Users can view tithe.ly config for their church" ON tithe_ly_config;
DROP POLICY IF EXISTS "Users can manage tithe.ly config for their church" ON tithe_ly_config;

-- Storage policies
DROP POLICY IF EXISTS "Users can upload content for their church" ON storage.objects;
DROP POLICY IF EXISTS "Users can view content for their church" ON storage.objects;
DROP POLICY IF EXISTS "Users can update content for their church" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete content for their church" ON storage.objects;

-- Recreate policies with correct org-based authentication

-- Church content policies
CREATE POLICY "Users can view content for their church" ON church_content
  FOR SELECT USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

CREATE POLICY "Users can insert content for their church" ON church_content
  FOR INSERT WITH CHECK (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

CREATE POLICY "Users can update content for their church" ON church_content
  FOR UPDATE USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

CREATE POLICY "Users can delete content for their church" ON church_content
  FOR DELETE USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

-- Tithe.ly config policies
CREATE POLICY "Users can view tithe.ly config for their church" ON tithe_ly_config
  FOR SELECT USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

CREATE POLICY "Users can manage tithe.ly config for their church" ON tithe_ly_config
  FOR ALL USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

-- Storage policies
CREATE POLICY "Users can upload content for their church" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'church-content' AND
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );

CREATE POLICY "Users can view content for their church" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'church-content' AND
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );

CREATE POLICY "Users can update content for their church" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'church-content' AND
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );

CREATE POLICY "Users can delete content for their church" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'church-content' AND
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );
