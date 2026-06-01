create extension if not exists pgcrypto;
create schema if not exists private;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  bio text,
  location text,
  role text default 'user' check (role in ('user', 'admin', 'creator')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

create table public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  channel_id uuid references public.channels(id),
  description text,
  info_count int default 0,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.infos (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id),
  channel_id uuid references public.channels(id),
  title text not null,
  content text,
  info_type text default 'note' check (info_type in ('note', 'rental', 'service', 'business', 'food', 'event', 'secondhand', 'guide', 'news', 'question')),
  cover_url text,
  images text[],
  contact_text text,
  price_text text,
  location_text text,
  source_type text default 'user' check (source_type in ('user', 'admin', 'ai')),
  is_ai_generated boolean default false,
  moderation_status text default 'approved' check (moderation_status in ('pending', 'approved', 'rejected')),
  status text default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.info_tags (
  id uuid primary key default gen_random_uuid(),
  info_id uuid references public.infos(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  created_at timestamptz default now(),
  unique (info_id, tag_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  info_id uuid references public.infos(id) on delete cascade,
  author_id uuid references public.profiles(id),
  content text not null,
  moderation_status text default 'approved' check (moderation_status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now()
);

create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  target_type text not null check (target_type in ('info', 'tag')),
  target_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id),
  target_type text not null,
  target_id uuid not null,
  reason text,
  status text default 'pending',
  created_at timestamptz default now()
);

create index idx_tags_channel on public.tags(channel_id);
create index idx_infos_channel_status on public.infos(channel_id, moderation_status, status);
create index idx_info_tags_info on public.info_tags(info_id);
create index idx_info_tags_tag on public.info_tags(tag_id);

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger channels_touch before update on public.channels for each row execute function public.touch_updated_at();
create trigger tags_touch before update on public.tags for each row execute function public.touch_updated_at();
create trigger infos_touch before update on public.infos for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.tags enable row level security;
alter table public.infos enable row level security;
alter table public.info_tags enable row level security;
alter table public.comments enable row level security;
alter table public.saved_items enable row level security;
alter table public.reports enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "profiles own update" on public.profiles for update using (id = auth.uid() or private.is_admin());

create policy "channels readable" on public.channels for select using (true);
create policy "channels admin insert" on public.channels for insert with check (private.is_admin());
create policy "channels admin update" on public.channels for update using (private.is_admin()) with check (private.is_admin());
create policy "channels admin delete" on public.channels for delete using (private.is_admin());

create policy "tags readable" on public.tags for select using (true);
create policy "tags admin insert" on public.tags for insert with check (private.is_admin());
create policy "tags admin update" on public.tags for update using (private.is_admin()) with check (private.is_admin());
create policy "tags admin delete" on public.tags for delete using (private.is_admin());

create policy "infos approved readable" on public.infos for select using (moderation_status = 'approved' and status = 'published' or author_id = auth.uid() or private.is_admin());
create policy "infos user insert pending" on public.infos for insert with check (auth.uid() = author_id and moderation_status = 'pending');
create policy "infos admin insert approved" on public.infos for insert with check (private.is_admin());
create policy "infos author admin update" on public.infos for update using (author_id = auth.uid() or private.is_admin()) with check (author_id = auth.uid() or private.is_admin());
create policy "infos admin delete" on public.infos for delete using (private.is_admin());

create policy "info tags readable" on public.info_tags for select using (true);
create policy "info tags author admin insert" on public.info_tags for insert with check (
  private.is_admin() or exists(select 1 from public.infos where id = info_id and author_id = auth.uid())
);
create policy "info tags author admin delete" on public.info_tags for delete using (
  private.is_admin() or exists(select 1 from public.infos where id = info_id and author_id = auth.uid())
);

create policy "comments approved readable" on public.comments for select using (moderation_status = 'approved' or author_id = auth.uid() or private.is_admin());
create policy "comments authenticated insert" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments author admin update" on public.comments for update using (author_id = auth.uid() or private.is_admin()) with check (author_id = auth.uid() or private.is_admin());
create policy "comments admin delete" on public.comments for delete using (private.is_admin());

create policy "saved own select" on public.saved_items for select using (user_id = auth.uid());
create policy "saved own insert" on public.saved_items for insert with check (user_id = auth.uid());
create policy "saved own delete" on public.saved_items for delete using (user_id = auth.uid());

create policy "reports authenticated insert" on public.reports for insert with check (reporter_id = auth.uid());
create policy "reports admin select" on public.reports for select using (private.is_admin());
create policy "reports admin update" on public.reports for update using (private.is_admin()) with check (private.is_admin());
