-- Stackwise schema for Supabase.
-- Run in the SQL editor after creating a project.
-- The frontend uses only the anon key. Never put the service_role key in Vite.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  role text not null default 'writer' check (role in ('admin', 'editor', 'writer')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default ''
);

create table if not exists public.affiliates (
  id text primary key,
  name text not null,
  url text not null
);

create table if not exists public.tools (
  id text primary key,
  name text not null,
  category text not null,
  rating numeric not null check (rating >= 0 and rating <= 10),
  affiliate_id text references public.affiliates (id) on delete set null,
  rank integer not null,
  blurb text not null default ''
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null default '',
  body text not null default '',
  category_id uuid references public.categories (id),
  cover_url text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'published')),
  author_id uuid not null references public.profiles (id),
  author_name text not null default '',
  youtube_url text,
  duration text,
  is_test boolean not null default false,
  read_minutes integer not null default 3,
  affiliate_id text references public.affiliates (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.affiliates enable row level security;
alter table public.tools enable row level security;
alter table public.posts enable row level security;
alter table public.subscribers enable row level security;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid() and active is true
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() = 'admin'
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_role() in ('editor', 'admin')
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, active)
  values (new.id, coalesce(new.email, ''), 'writer', true)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- profiles: a person can read their own row; editors and admins can read the team; only admins change role or active.
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_editor_or_admin());

create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy categories_read on public.categories
  for select to anon, authenticated
  using (true);

create policy categories_write on public.categories
  for all to authenticated
  using (public.is_editor_or_admin())
  with check (public.is_editor_or_admin());

create policy affiliates_read on public.affiliates
  for select to anon, authenticated
  using (true);

create policy affiliates_admin on public.affiliates
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy tools_read on public.tools
  for select to anon, authenticated
  using (true);

create policy tools_admin on public.tools
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Public reads published stories. Editors and admins read everything.
-- Writers can also read their own drafts.
create policy posts_read on public.posts
  for select to anon, authenticated
  using (
    status = 'published'
    or public.is_editor_or_admin()
    or author_id = auth.uid()
  );

create policy posts_insert on public.posts
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and (
      public.is_editor_or_admin()
      or (public.current_role() = 'writer' and status in ('draft', 'in_review'))
    )
  );

create policy posts_update on public.posts
  for update to authenticated
  using (
    public.is_editor_or_admin()
    or (
      author_id = auth.uid()
      and public.current_role() = 'writer'
      and status in ('draft', 'in_review')
    )
  )
  with check (
    public.is_editor_or_admin()
    or (
      author_id = auth.uid()
      and public.current_role() = 'writer'
      and status in ('draft', 'in_review')
    )
  );

create policy posts_delete on public.posts
  for delete to authenticated
  using (public.is_editor_or_admin());

create policy subscribers_insert on public.subscribers
  for insert to anon, authenticated
  with check (true);

create policy subscribers_read on public.subscribers
  for select to authenticated
  using (public.is_editor_or_admin());

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.tools, public.affiliates, public.posts to anon, authenticated;
grant insert on public.subscribers to anon, authenticated;
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.tools to authenticated;
grant select, insert, update, delete on public.affiliates to authenticated;
grant select on public.subscribers, public.profiles to authenticated;
grant update on public.profiles to authenticated;

insert into public.categories (id, slug, name, description) values
  ('11111111-1111-4111-8111-111111111111', 'crypto', 'Crypto', 'Wallets, custody, and on-chain tools we actually opened.'),
  ('22222222-2222-4222-8222-222222222222', 'ai-tools', 'AI Tools', 'Models and apps tested on real work, not a demo prompt.'),
  ('33333333-3333-4333-8333-333333333333', 'saas', 'SaaS', 'Software a small team can justify on a real invoice.'),
  ('44444444-4444-4444-8444-444444444444', 'reviews', 'Reviews', 'Single-product tests with a clear keep or skip.'),
  ('55555555-5555-4555-8555-555555555555', 'comparisons', 'Comparisons', 'Head-to-head tests that share one task list.'),
  ('66666666-6666-4666-8666-666666666666', 'guides', 'Guides', 'How we test, and how to do the careful version yourself.'),
  ('77777777-7777-4777-8777-777777777777', 'deals', 'Deals', 'Annual plans and upgrades that still look fair this month.')
on conflict (slug) do nothing;

insert into public.affiliates (id, name, url) values
  ('aff-ledger', 'Ledger', 'https://example.com/go/ledger'),
  ('aff-cursor', 'Cursor', 'https://example.com/go/cursor'),
  ('aff-proton', 'Proton Pass', 'https://example.com/go/proton-pass'),
  ('aff-linear', 'Linear', 'https://example.com/go/linear'),
  ('aff-phantom', 'Phantom', 'https://example.com/go/phantom')
on conflict (id) do nothing;

insert into public.tools (id, name, category, rating, affiliate_id, rank, blurb) values
  ('tool-ledger', 'Ledger Flex', 'Hardware wallet', 9.2, 'aff-ledger', 1, 'A screen you can read and a backup you can explain.'),
  ('tool-cursor', 'Cursor', 'AI editor', 9.0, 'aff-cursor', 2, 'The coding assistant we actually left installed.'),
  ('tool-proton', 'Proton Pass', 'Passwords', 8.7, 'aff-proton', 3, 'The manager we let near a throwaway seed phrase.'),
  ('tool-linear', 'Linear', 'Issue tracker', 8.6, 'aff-linear', 4, 'Fast enough that the team files the bug.'),
  ('tool-phantom', 'Phantom', 'Software wallet', 8.1, 'aff-phantom', 5, 'Fine for small tests. Not where savings live.')
on conflict (id) do nothing;

-- Make the first admin after that person has signed up once
-- (the trigger creates them as a writer):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
