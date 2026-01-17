-- Create storage bucket for church content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'church-content',
  'church-content',
  true,
  52428800, -- 50MB
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload content for their church" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'church-content' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Users can view content for their church" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'church-content' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Users can update content for their church" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'church-content' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );

CREATE POLICY "Users can delete content for their church" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'church-content' AND
    auth.uid()::text = (SPLIT_PART(name, '/', 1))
  );
