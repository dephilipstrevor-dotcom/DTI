-- =============================================================
-- GradRoute database schema
-- Run this in the Supabase SQL editor (one-time).
-- Idempotent: safe to re-run.
-- =============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

-- ---------- intake_data ----------
create table if not exists public.intake_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  "degreeLevel" text,
  "previousDegree" text,
  "fieldOfStudy" text,
  cgpa numeric,
  backlogs int default 0,
  ielts numeric,
  gre int,
  portfolio text,
  budget bigint,
  "fundingSource" text,
  "targetRole" text,
  "workExperience" numeric,
  "intakeTerm" text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);

-- ---------- universities (master catalog) ----------
create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  program text not null,
  country text not null,
  city text,
  "degreeLevel" text not null,
  "fieldOfStudy" text not null,
  "minCgpa" numeric not null,
  "maxBacklogs" int default 5,
  "ieltsRequired" numeric,
  "greRequired" int,
  "tuitionPerYear" bigint default 0,
  "livingCostPerYear" bigint default 0,
  "totalCostPerYear" bigint not null,
  "prTimelineMonths" int default 48,
  ranking int,
  "applicationDeadline" text,
  "intakeTerms" text,
  notes text,
  created_at timestamptz default now()
);

-- ---------- routes (generated per user) ----------
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  university_id uuid references public.universities(id) on delete set null,
  tier text check (tier in ('safe','moderate','ambitious')) default 'moderate',
  university text not null,
  program text,
  country text,
  feasibility int default 50,
  total_cost bigint default 0,
  pr_timeline int default 48,
  roi_vector text,
  market_demand text,
  saved boolean default false,
  created_at timestamptz default now()
);
create index if not exists routes_user_idx on public.routes(user_id);

-- ---------- conversations ----------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'New Conversation',
  created_at timestamptz default now()
);
create index if not exists conversations_user_idx on public.conversations(user_id);

-- ---------- messages ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text check (role in ('user','assistant','system')) not null,
  content text not null,
  module jsonb,
  created_at timestamptz default now()
);
create index if not exists messages_conv_idx on public.messages(conversation_id);

-- =============================================================
-- Auth trigger: copy new users into profiles
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles      enable row level security;
alter table public.intake_data   enable row level security;
alter table public.routes        enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;
alter table public.universities  enable row level security;

-- profiles
drop policy if exists "profiles self read"   on public.profiles;
drop policy if exists "profiles self write"  on public.profiles;
create policy "profiles self read"  on public.profiles for select using (auth.uid() = id);
create policy "profiles self write" on public.profiles for update using (auth.uid() = id);

-- intake_data
drop policy if exists "intake self all" on public.intake_data;
create policy "intake self all" on public.intake_data
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- routes
drop policy if exists "routes self all" on public.routes;
create policy "routes self all" on public.routes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- conversations
drop policy if exists "conv self all" on public.conversations;
create policy "conv self all" on public.conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- messages: tied to conversation owner
drop policy if exists "msg self all" on public.messages;
create policy "msg self all" on public.messages
  for all using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid()
    )
  );

-- universities: world-readable catalog
drop policy if exists "universities readable" on public.universities;
create policy "universities readable" on public.universities for select using (true);
