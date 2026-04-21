alter table public.posts
  add column if not exists owner_approved boolean not null default false,
  add column if not exists price_verified boolean not null default false,
  add column if not exists requires_price_verification boolean not null default false;

alter table public.assets
  add column if not exists file_size_bytes bigint;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  email text not null unique,
  role text not null default 'editor' check (role in ('owner', 'admin', 'editor', 'viewer')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists admin_users_role_idx on public.admin_users (role);

create or replace function public.current_scheduler_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_users
  where
    (user_id is not null and user_id = auth.uid())
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  order by case when user_id = auth.uid() then 0 else 1 end
  limit 1;
$$;

grant execute on function public.current_scheduler_role() to authenticated;

alter table public.admin_users enable row level security;

drop policy if exists "authenticated can read posts" on public.posts;
drop policy if exists "authenticated can manage posts" on public.posts;
drop policy if exists "authenticated can read assets" on public.assets;
drop policy if exists "authenticated can manage assets" on public.assets;
drop policy if exists "authenticated can read metrics" on public.metrics;
drop policy if exists "authenticated can manage metrics" on public.metrics;
drop policy if exists "authenticated can read templates" on public.content_templates;
drop policy if exists "authenticated can manage templates" on public.content_templates;

create policy "allowlisted users can read posts"
on public.posts
for select
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor', 'viewer'));

create policy "editors and above can manage posts"
on public.posts
for all
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor'))
with check (public.current_scheduler_role() in ('owner', 'admin', 'editor'));

create policy "allowlisted users can read assets"
on public.assets
for select
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor', 'viewer'));

create policy "editors and above can manage assets"
on public.assets
for all
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor'))
with check (public.current_scheduler_role() in ('owner', 'admin', 'editor'));

create policy "allowlisted users can read metrics"
on public.metrics
for select
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor', 'viewer'));

create policy "admins can manage metrics"
on public.metrics
for all
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin'))
with check (public.current_scheduler_role() in ('owner', 'admin'));

create policy "allowlisted users can read templates"
on public.content_templates
for select
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor', 'viewer'));

create policy "editors and above can manage templates"
on public.content_templates
for all
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin', 'editor'))
with check (public.current_scheduler_role() in ('owner', 'admin', 'editor'));

create policy "allowlisted users can read their role"
on public.admin_users
for select
to authenticated
using (
  public.current_scheduler_role() in ('owner', 'admin')
  or user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "owners and admins can manage allowlist"
on public.admin_users
for all
to authenticated
using (public.current_scheduler_role() in ('owner', 'admin'))
with check (public.current_scheduler_role() in ('owner', 'admin'));
