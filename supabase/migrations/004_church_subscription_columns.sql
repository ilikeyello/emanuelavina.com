-- Add subscription tracking fields to churches
alter table public.churches
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists subscription_period_end timestamptz;

-- Helpful index for webhook lookups
create index if not exists idx_churches_stripe_customer_id on public.churches(stripe_customer_id);
create index if not exists idx_churches_stripe_subscription_id on public.churches(stripe_subscription_id);
