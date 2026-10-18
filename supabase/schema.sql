-- Run this entire file in Supabase Dashboard > SQL Editor.
-- Supabase Auth identifies each user. RLS ensures each user can only access their own data.
create table if not exists public.study_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.study_state enable row level security;

create policy "Users can read their own study state"
  on public.study_state for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study state"
  on public.study_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study state"
  on public.study_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists study_state_updated_at_idx
  on public.study_state(updated_at);
