-- Arva Talks Academy — Drawing Pad
-- Supabase schema. Run this in your Supabase project: SQL Editor > New query.
-- Stage 1 stores each teaching session (with all its boards) as one JSON row.

create extension if not exists "pgcrypto";

-- A "project" = one teaching session containing many boards.
-- id is text because the app generates client-side ids.
create table if not exists public.projects (
  id          text primary key,
  owner       uuid references auth.users (id) on delete cascade,
  title       text not null default 'Untitled session',
  data        jsonb not null default '{}'::jsonb,  -- { boards: [...] }
  is_shared   boolean not null default false,      -- public read-only link
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects (owner);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- Row level security: a mentor sees only their own sessions.
alter table public.projects enable row level security;

drop policy if exists "owner can read"   on public.projects;
drop policy if exists "owner can write"  on public.projects;
drop policy if exists "owner can update" on public.projects;
drop policy if exists "owner can delete" on public.projects;

-- Owner has full access; anyone may read a session that is explicitly shared.
create policy "owner can read"   on public.projects for select using (auth.uid() = owner);
create policy "shared is public" on public.projects for select using (is_shared = true);
create policy "owner can write"  on public.projects for insert with check (auth.uid() = owner);
create policy "owner can update" on public.projects for update using (auth.uid() = owner);
create policy "owner can delete" on public.projects for delete using (auth.uid() = owner);

-- ── Stage 3 (polls) — schema ready for when we build live polls ──
create table if not exists public.polls (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid references auth.users (id) on delete cascade,
  code        text unique not null,            -- short join code for students
  question    text not null,
  options     jsonb not null default '[]'::jsonb,
  is_open     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.poll_votes (
  id          uuid primary key default gen_random_uuid(),
  poll_id     uuid references public.polls (id) on delete cascade,
  option_index int not null,
  voter_token text not null,                   -- anonymous per-student token
  created_at  timestamptz not null default now(),
  unique (poll_id, voter_token)
);
