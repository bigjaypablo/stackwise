create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  name text not null check (char_length(name) between 2 and 40),
  body text not null check (
    char_length(body) between 3 and 1500
    and body !~* '(https?://|www\.)'
  ),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments (post_slug, status, created_at desc);

alter table public.comments enable row level security;

create policy "read approved comments" on public.comments
  for select using (status = 'approved');

create policy "anyone can submit a pending comment" on public.comments
  for insert with check (status = 'pending');

create policy "editors read all comments" on public.comments
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'editor')));

create policy "editors moderate comments" on public.comments
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'editor')))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'editor')));

create policy "editors delete comments" on public.comments
  for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'editor')));
