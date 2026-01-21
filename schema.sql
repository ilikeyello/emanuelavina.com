-- This schema is idempotent and can be run multiple times without causing errors.

-- 1. Custom function to get the organization ID from the JWT.
create or replace function requesting_org_id()
returns text
language sql stable
as $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'org_id', '')::text;
$$;

-- 2. Churches Table
create table if not exists public.churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  clerk_org_id text not null unique,
  created_at timestamptz not null default now()
);

-- 3. Sermons Table
create table if not exists public.sermons (
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
drop policy if exists "Allow users to see their own church" on public.churches;
create policy "Allow users to see their own church" on public.churches
  for select
  using (clerk_org_id = requesting_org_id());

-- 6. RLS Policies for 'sermons' table
drop policy if exists "Allow users to see sermons from their church" on public.sermons;
create policy "Allow users to see sermons from their church" on public.sermons
  for select
  using (
    exists (
      select 1
      from public.churches
      where churches.id = sermons.church_id and churches.clerk_org_id = requesting_org_id()
    )
  );

drop policy if exists "Allow users to create sermons for their church" on public.sermons;
create policy "Allow users to create sermons for their church" on public.sermons
 for insert
 with check (church_id = (select id from public.churches where clerk_org_id = requesting_org_id()));

