-- Micro-SaaS: profiles + public sharing (run in Supabase SQL Editor)

-- Profiles (subscription + branding)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'pro', 'cancelled')),
  lemon_customer_id text,
  lemon_subscription_id text,
  logo_url text,
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_subscription_status_idx
  on public.profiles (subscription_status);

alter table public.profiles enable row level security;

drop policy if exists "Users can select own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can select own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

-- Public branding read (logo + plan) for shared proposal pages
drop policy if exists "Anyone can read profile branding" on public.profiles;
create policy "Anyone can read profile branding"
on public.profiles for select
to anon, authenticated
using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, subscription_status)
  values (new.id, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public sharing flag on proposals
alter table public.proposals
  add column if not exists is_public boolean not null default true;

drop policy if exists "Public can read shared proposals" on public.proposals;
create policy "Public can read shared proposals"
on public.proposals
for select
to anon, authenticated
using (is_public = true);

-- Logo storage bucket (run once; ignore error if exists)
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

drop policy if exists "Users can upload own logo" on storage.objects;
drop policy if exists "Users can update own logo" on storage.objects;
drop policy if exists "Users can delete own logo" on storage.objects;
drop policy if exists "Public can read logos" on storage.objects;

create policy "Users can upload own logo"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own logo"
on storage.objects for update to authenticated
using (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own logo"
on storage.objects for delete to authenticated
using (
  bucket_id = 'logos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Public can read logos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'logos');

grant select, insert, update on table public.profiles to authenticated;
