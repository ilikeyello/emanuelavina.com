-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CHURCHES TABLE
-- Stores app-specific settings for each Clerk Organization.
-- We map 'clerk_org_id' to this table to link data.
create table if not exists public.churches (
  id uuid default uuid_generate_v4() primary key,
  clerk_org_id text not null unique,
  name text,
  subscription_plan text, -- 'basic', 'growth', 'premium'
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CHURCH MEDIA TABLE
-- Stores metadata for uploaded files (sermons, bulletins, images).
create table if not exists public.church_media (
  id uuid default uuid_generate_v4() primary key,
  church_id uuid references public.churches(id) on delete cascade not null,
  title text not null,
  file_path text not null, -- Path in Storage bucket
  public_url text not null,
  file_type text, -- 'image/jpeg', 'application/pdf', etc.
  size_bytes bigint,
  uploaded_by text, -- Clerk User ID
  created_at timestamptz default now()
);

-- 3. ENABLE ROW LEVEL SECURITY
alter table public.churches enable row level security;
alter table public.church_media enable row level security;

-- 4. RLS POLICIES
-- NOTE: These policies assume your Clerk JWT Template includes an 'org_id' claim.
-- Go to Clerk Dashboard > JWT Templates > New > Select Supabase > Add 'org_id': '{{org.id}}'

-- Policy: Churches
-- Allow read/update if the row's clerk_org_id matches the active Org ID in the JWT.
create policy "Allow org members to view their church" on public.churches
  for select
  using ( clerk_org_id = (auth.jwt() ->> 'org_id') );

create policy "Allow org admins to update their church" on public.churches
  for update
  using ( clerk_org_id = (auth.jwt() ->> 'org_id') );

create policy "Allow org admins to insert their church" on public.churches
  for insert
  with check ( clerk_org_id = (auth.jwt() ->> 'org_id') );

-- Policy: Media
-- Allow access if the media belongs to a church the user has access to.
create policy "Allow org members to view media" on public.church_media
  for select
  using (
    church_id in (
      select id from public.churches 
      where clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

create policy "Allow org members to insert media" on public.church_media
  for insert
  with check (
    church_id in (
      select id from public.churches 
      where clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

create policy "Allow org members to delete media" on public.church_media
  for delete
  using (
    church_id in (
      select id from public.churches 
      where clerk_org_id = (auth.jwt() ->> 'org_id')
    )
  );

-- 5. STORAGE BUCKET SETUP
-- Create a public bucket for church media
insert into storage.buckets (id, name, public) 
values ('church-media', 'church-media', true)
on conflict (id) do nothing;

-- Storage Policies
-- We enforce folder structure: /clerk_org_id/filename
create policy "Allow org members to upload to their folder" on storage.objects
  for insert
  with check (
    bucket_id = 'church-media' and
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );

create policy "Allow org members to select from their folder" on storage.objects
  for select
  using (
    bucket_id = 'church-media' and
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );

create policy "Allow org members to delete from their folder" on storage.objects
  for delete
  using (
    bucket_id = 'church-media' and
    (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );
