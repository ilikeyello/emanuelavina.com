-- Church content table for various types of content based on subscription
CREATE TABLE IF NOT EXISTS church_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('event', 'announcement', 'sermon', 'blog', 'music', 'livestream')),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT,
  public_url TEXT,
  youtube_url TEXT,
  youtube_playlist_url TEXT,
  file_type TEXT,
  size_bytes BIGINT,
  metadata JSONB DEFAULT '{}',
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tithe.ly configuration table
CREATE TABLE IF NOT EXISTS tithe_ly_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID REFERENCES churches(id) ON DELETE CASCADE UNIQUE,
  account_id TEXT,
  api_key TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_church_content_church_id ON church_content(church_id);
CREATE INDEX idx_church_content_type ON church_content(type);
CREATE INDEX idx_church_content_created_at ON church_content(created_at DESC);

-- RLS policies
ALTER TABLE church_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE tithe_ly_config ENABLE ROW LEVEL SECURITY;

-- Church content policies
CREATE POLICY "Users can view content for their church" ON church_content
  FOR SELECT USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert content for their church" ON church_content
  FOR INSERT WITH CHECK (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = auth.uid()
    )
  );

CREATE POLICY "Users can update content for their church" ON church_content
  FOR UPDATE USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete content for their church" ON church_content
  FOR DELETE USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = auth.uid()
    )
  );

-- Tithe.ly config policies
CREATE POLICY "Users can view tithe.ly config for their church" ON tithe_ly_config
  FOR SELECT USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tithe.ly config for their church" ON tithe_ly_config
  FOR ALL USING (
    church_id IN (
      SELECT id FROM churches WHERE clerk_org_id = auth.uid()
    )
  );
