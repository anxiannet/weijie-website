create table public.search_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  query text not null,
  normalized_query text,
  matched_tag_id uuid references public.tags(id),
  matched_channel_id uuid references public.channels(id),
  result_count int default 0,
  created_at timestamptz default now()
);

create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  path text not null,
  target_type text check (target_type in ('home', 'channel', 'tag', 'info', 'search', 'admin')),
  target_id uuid,
  referrer text,
  created_at timestamptz default now()
);

create table public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('info', 'comment', 'profile', 'tag')),
  target_id uuid not null,
  reason text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

create table public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.channels(id),
  tag_id uuid references public.tags(id),
  title text not null,
  content text not null,
  prompt text,
  draft_type text default 'info' check (draft_type in ('info', 'tag_description', 'channel_seed')),
  status text default 'draft' check (status in ('draft', 'reviewing', 'published', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.admin_tasks (
  id uuid primary key default gen_random_uuid(),
  task_type text not null check (task_type in ('review_info', 'review_comment', 'create_tag', 'merge_tag', 'generate_ai_info', 'check_empty_tag', 'check_popular_search', 'upgrade_tag_to_module')),
  target_type text,
  target_id uuid,
  title text not null,
  description text,
  status text default 'pending',
  priority int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_search_logs_created on public.search_logs(created_at desc);
create index idx_search_logs_query on public.search_logs(normalized_query);
create index idx_page_views_target on public.page_views(target_type, target_id);
create index idx_moderation_status on public.moderation_queue(status);
create index idx_ai_drafts_status on public.ai_drafts(status);

create trigger ai_drafts_touch before update on public.ai_drafts for each row execute function public.touch_updated_at();
create trigger admin_tasks_touch before update on public.admin_tasks for each row execute function public.touch_updated_at();

alter table public.search_logs enable row level security;
alter table public.page_views enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.ai_drafts enable row level security;
alter table public.admin_tasks enable row level security;

create policy "search logs insertable" on public.search_logs for insert with check (true);
create policy "search logs admin select" on public.search_logs for select using (private.is_admin());

create policy "page views insertable" on public.page_views for insert with check (true);
create policy "page views admin select" on public.page_views for select using (private.is_admin());

create policy "moderation admin select" on public.moderation_queue for select using (private.is_admin());
create policy "moderation admin insert" on public.moderation_queue for insert with check (private.is_admin());
create policy "moderation admin update" on public.moderation_queue for update using (private.is_admin()) with check (private.is_admin());

create policy "ai drafts admin select" on public.ai_drafts for select using (private.is_admin());
create policy "ai drafts admin insert" on public.ai_drafts for insert with check (private.is_admin());
create policy "ai drafts admin update" on public.ai_drafts for update using (private.is_admin()) with check (private.is_admin());
create policy "ai drafts admin delete" on public.ai_drafts for delete using (private.is_admin());

create policy "admin tasks admin select" on public.admin_tasks for select using (private.is_admin());
create policy "admin tasks admin insert" on public.admin_tasks for insert with check (private.is_admin());
create policy "admin tasks admin update" on public.admin_tasks for update using (private.is_admin()) with check (private.is_admin());
