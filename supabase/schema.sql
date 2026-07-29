-- Proposaly: proposals schema for Supabase
-- Run this in the Supabase SQL Editor (or via supabase db push).

create extension if not exists "pgcrypto";

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_name text not null,
  project_name text not null,
  line_items jsonb not null default '[]'::jsonb,
  notes text not null default '',
  currency varchar(3) not null default 'USD',
  total_amount numeric(12, 2) not null default 0,
  status varchar(32) not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_user_id_idx on public.proposals (user_id);
create index if not exists proposals_created_at_idx on public.proposals (created_at desc);

create or replace function public.set_proposals_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists proposals_set_updated_at on public.proposals;

create trigger proposals_set_updated_at
before update on public.proposals
for each row
execute function public.set_proposals_updated_at();

alter table public.proposals enable row level security;

drop policy if exists "Users can select own proposals" on public.proposals;
drop policy if exists "Users can insert own proposals" on public.proposals;
drop policy if exists "Users can update own proposals" on public.proposals;
drop policy if exists "Users can delete own proposals" on public.proposals;

create policy "Users can select own proposals"
on public.proposals
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own proposals"
on public.proposals
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own proposals"
on public.proposals
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own proposals"
on public.proposals
for delete
to authenticated
using (auth.uid() = user_id);
