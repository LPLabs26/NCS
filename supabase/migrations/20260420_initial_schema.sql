create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null default 'instagram',
  format text not null check (format in ('reel', 'image', 'carousel', 'story')),
  pillar text,
  status text not null default 'draft' check (status in ('draft', 'needs_asset', 'approved', 'scheduled', 'publishing', 'published', 'failed')),
  caption text,
  hashtags text[] not null default '{}',
  cta text,
  scheduled_at timestamptz,
  timezone text not null default 'America/Los_Angeles',
  asset_ids uuid[] not null default '{}',
  meta_container_id text,
  meta_media_id text,
  permalink text,
  error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  type text not null check (type in ('image', 'video')),
  storage_url text not null,
  public_url text not null,
  aspect_ratio text,
  duration_sec numeric,
  width integer,
  height integer,
  alt_text text,
  checksum text,
  usage_rights_confirmed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  collected_at timestamptz not null default timezone('utc', now()),
  reach integer,
  impressions integer,
  views integer,
  likes integer,
  comments integer,
  saves integer,
  shares integer,
  profile_visits integer,
  website_taps integer
);

create table if not exists public.content_templates (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  pillar text not null,
  hook text not null,
  caption_template text not null,
  cta text,
  hashtags text[] not null default '{}'
);

create index if not exists posts_status_scheduled_at_idx on public.posts (status, scheduled_at);
create index if not exists posts_format_pillar_idx on public.posts (format, pillar);
create index if not exists metrics_post_id_collected_at_idx on public.metrics (post_id, collected_at desc);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();

alter table public.posts enable row level security;
alter table public.assets enable row level security;
alter table public.metrics enable row level security;
alter table public.content_templates enable row level security;

create policy "authenticated can read posts"
on public.posts
for select
to authenticated
using (true);

create policy "authenticated can manage posts"
on public.posts
for all
to authenticated
using (true)
with check (true);

create policy "authenticated can read assets"
on public.assets
for select
to authenticated
using (true);

create policy "authenticated can manage assets"
on public.assets
for all
to authenticated
using (true)
with check (true);

create policy "authenticated can read metrics"
on public.metrics
for select
to authenticated
using (true);

create policy "authenticated can manage metrics"
on public.metrics
for all
to authenticated
using (true)
with check (true);

create policy "authenticated can read templates"
on public.content_templates
for select
to authenticated
using (true);

create policy "authenticated can manage templates"
on public.content_templates
for all
to authenticated
using (true)
with check (true);
