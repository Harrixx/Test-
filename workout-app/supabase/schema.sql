-- Lift Log database. Run this in Supabase > SQL Editor. Safe to re-run.
-- One row per person, holding all their plans, logs and settings as JSON.

create table if not exists public.lift_logs (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint lift_logs_state_size check (pg_column_size(state) < 1000000)
);

alter table public.lift_logs enable row level security;

revoke all on public.lift_logs from anon;
grant select, insert, update, delete on public.lift_logs to authenticated;

-- Each person can only see and change their own row.
drop policy if exists "Read own log"   on public.lift_logs;
drop policy if exists "Add own log"    on public.lift_logs;
drop policy if exists "Change own log" on public.lift_logs;
drop policy if exists "Delete own log" on public.lift_logs;

create policy "Read own log"   on public.lift_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own log"    on public.lift_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Change own log" on public.lift_logs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own log" on public.lift_logs for delete to authenticated using ((select auth.uid()) = user_id);
