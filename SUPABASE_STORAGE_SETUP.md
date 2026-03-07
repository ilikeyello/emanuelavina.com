# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage for handling image uploads in announcements and events.

## 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New bucket**
5. Configure the bucket:
   - **Name**: `church-content`
   - **Public bucket**: ✅ Enable (so images can be accessed publicly)
   - Click **Create bucket**

## 2. Set Up Storage Policies

After creating the bucket, you need to set up policies for access control:

### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'church-content');
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'church-content');
```

### Policy 3: Allow Authenticated Delete (Optional)
```sql
CREATE POLICY "Authenticated users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'church-content');
```

## 3. Apply Policies in Supabase Dashboard

1. In the Storage section, click on your `church-content` bucket
2. Go to the **Policies** tab
3. Click **New Policy**
4. For each policy above:
   - Choose the appropriate operation (SELECT, INSERT, DELETE)
   - Set the target roles
   - Add the policy definition
   - Click **Review** and then **Save policy**

## 4. Verify Setup

Test the upload functionality:
1. Go to your admin dashboard
2. Create a new announcement or event
3. Try uploading an image using the rich text editor
4. The image should upload to Supabase Storage and display in the editor

## 5. File Organization

Images are organized by organization ID:
```
church-content/
  └── {orgId}/
      ├── {timestamp}-{random}.jpg
      ├── {timestamp}-{random}.png
      └── ...
```

## 6. Storage Limits

- Maximum file size: 5MB (configured in the API)
- Allowed file types: JPEG, JPG, PNG, GIF, WEBP
- Files are automatically compressed before upload (max 1MB after compression)

## Troubleshooting

### Images not uploading
- Check that the `church-content` bucket exists
- Verify storage policies are correctly set up
- Check browser console for error messages

### Images not displaying
- Ensure the bucket is set to **Public**
- Verify the public URL is being generated correctly
- Check CORS settings if accessing from a different domain
