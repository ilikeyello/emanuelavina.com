-- 1. Custom function to get the organization ID from the JWT.
-- This function securely extracts the 'org_id' from the JWT claims of the authenticated user.
-- IMPORTANT: You must configure a 'supabase' JWT template in your Clerk dashboard
-- and add the following custom claim: "org_id": "{{session.org_id}}"
create or replace function requesting_org_id()
returns text
language sql stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'org_id', '')::text;
$$;

-- 2. Churches Table
-- Stores information about each church, linked to a Clerk Organization.
create table public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  clerk_org_id text not null unique,
  created_at timestamptz not null default now()
);

-- 3. Sermons Table
-- Stores sermons, with each sermon belonging to a church.
create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  church_id uuid not null references public.churches(id) on delete cascade,
  title text not null,
  preacher text not null,
  audio_url text,
  sermon_date date not null,
  created_at timestamptz not null default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.churches enable row level security;
alter table public.sermons enable row level security;

-- 5. RLS Policies for 'churches' table
-- Users can only see churches that match their active organization ID.
create policy "Allow users to see their own church" on public.churches
  for select
  using (clerk_org_id = requesting_org_id());

-- 6. RLS Policies for 'sermons' table
-- Users can only see sermons belonging to a church they have access to.
create policy "Allow users to see sermons from their church" on public.sermons
  for select
  using (
    exists (
      select 1
      from public.churches
      where churches.id = sermons.church_id
    )
  );

-- Note: Policies for INSERT, UPDATE, DELETE are not included here.
-- You would typically add those with similar logic, ensuring that a user
-- can only modify data associated with their organization.
-- Example INSERT policy:
-- create policy "Allow users to create sermons for their church" on public.sermons
--  for insert
--  with check (church_id = (select id from public.churches where clerk_org_id = requesting_org_id()));
