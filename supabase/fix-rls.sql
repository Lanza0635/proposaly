-- Re-apply RLS policies for proposals (run in Supabase SQL Editor)
-- Ensures: auth.uid() = user_id for INSERT / SELECT / UPDATE / DELETE

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

grant select, insert, update, delete on table public.proposals to authenticated;
