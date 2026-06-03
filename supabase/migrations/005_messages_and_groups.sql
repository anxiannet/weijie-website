alter table public.infos
  add column if not exists contact_visibility text default 'private' check (contact_visibility in ('public', 'login_required', 'verified_only', 'private')),
  add column if not exists contact_note text,
  add column if not exists allow_messages boolean default true;

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  info_id uuid references public.infos(id) on delete set null,
  publisher_id uuid references public.profiles(id),
  initiator_id uuid references public.profiles(id),
  last_message text,
  last_message_at timestamptz,
  publisher_unread_count int default 0,
  initiator_unread_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (info_id, initiator_id),
  check (publisher_id is null or initiator_id is null or publisher_id <> initiator_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  receiver_id uuid references public.profiles(id),
  body text not null check (char_length(body) between 1 and 1000),
  message_type text default 'text',
  created_at timestamptz default now(),
  read_at timestamptz
);

create table public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references public.profiles(id),
  blocked_id uuid references public.profiles(id),
  reason text,
  created_at timestamptz default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id is null or blocked_id is null or blocker_id <> blocked_id)
);

create table public.message_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id) on delete cascade,
  reporter_id uuid references public.profiles(id),
  reason text,
  status text default 'pending' check (status in ('pending', 'handled', 'dismissed')),
  created_at timestamptz default now()
);

create table public.group_chats (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_url text,
  group_type text default 'tag' check (group_type in ('tag', 'event', 'rental', 'interest', 'temporary', 'general')),
  tag_id uuid references public.tags(id) on delete set null,
  channel_id uuid references public.channels(id) on delete set null,
  creator_id uuid references public.profiles(id),
  join_policy text default 'open' check (join_policy in ('open', 'approval_required', 'invite_only', 'closed')),
  status text default 'active' check (status in ('active', 'closed', 'archived')),
  member_count int default 0,
  message_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.group_infos (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.group_chats(id) on delete cascade,
  info_id uuid references public.infos(id) on delete cascade,
  added_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  unique (group_id, info_id)
);

create table public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.group_chats(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  member_role text default 'member' check (member_role in ('owner', 'admin', 'member')),
  status text default 'active' check (status in ('active', 'pending', 'removed', 'left', 'banned')),
  joined_at timestamptz default now(),
  last_read_at timestamptz,
  muted boolean default false,
  unique (group_id, user_id)
);

create table public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.group_chats(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  body text not null check (char_length(body) between 1 and 1000),
  message_type text default 'text',
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table public.group_join_requests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.group_chats(id) on delete cascade,
  requester_id uuid references public.profiles(id),
  message text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  reviewed_at timestamptz,
  unique (group_id, requester_id, status)
);

create table public.group_reports (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.group_chats(id) on delete cascade,
  message_id uuid references public.group_messages(id) on delete set null,
  reporter_id uuid references public.profiles(id),
  reason text,
  status text default 'pending' check (status in ('pending', 'handled', 'dismissed')),
  created_at timestamptz default now()
);

create or replace function public.is_conversation_member(target_conversation_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.conversations
    where id = target_conversation_id
      and (publisher_id = (select auth.uid()) or initiator_id = (select auth.uid()))
  );
$$;

create or replace function public.is_group_role(target_group_id uuid, roles text[])
returns boolean language sql stable as $$
  select exists (
    select 1 from public.group_members
    where group_id = target_group_id
      and user_id = (select auth.uid())
      and status = 'active'
      and member_role = any(roles)
  );
$$;

create or replace function public.is_active_group_member(target_group_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.group_members
    where group_id = target_group_id
      and user_id = (select auth.uid())
      and status = 'active'
  );
$$;

create or replace function public.can_create_conversation(target_info_id uuid, target_publisher_id uuid, target_initiator_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.infos
    where id = target_info_id
      and author_id = target_publisher_id
      and author_id <> target_initiator_id
      and allow_messages = true
  );
$$;

create or replace function public.can_send_private_message(target_conversation_id uuid, target_sender_id uuid, target_receiver_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.conversations
    where id = target_conversation_id
      and target_sender_id = (select auth.uid())
      and (
        (publisher_id = target_sender_id and initiator_id = target_receiver_id)
        or (initiator_id = target_sender_id and publisher_id = target_receiver_id)
      )
  )
  and not exists (
    select 1 from public.blocked_users
    where blocker_id = target_receiver_id and blocked_id = target_sender_id
  );
$$;

create or replace function public.private_daily_contact_count(target_user_id uuid)
returns int language sql stable as $$
  select count(distinct info_id)::int
  from public.conversations
  where initiator_id = target_user_id
    and created_at >= date_trunc('day', now());
$$;

create or replace function public.private_minute_message_count(target_user_id uuid)
returns int language sql stable as $$
  select count(*)::int
  from public.messages
  where sender_id = target_user_id
    and created_at >= now() - interval '1 minute';
$$;

create or replace function public.group_daily_create_count(target_user_id uuid)
returns int language sql stable as $$
  select count(*)::int
  from public.group_chats
  where creator_id = target_user_id
    and created_at >= date_trunc('day', now());
$$;

create or replace function public.group_minute_message_count(target_user_id uuid)
returns int language sql stable as $$
  select count(*)::int
  from public.group_messages
  where sender_id = target_user_id
    and created_at >= now() - interval '1 minute';
$$;

create index idx_conversations_participants on public.conversations(publisher_id, initiator_id);
create index idx_conversations_info on public.conversations(info_id);
create index idx_messages_conversation_created on public.messages(conversation_id, created_at);
create index idx_blocked_users_blocked on public.blocked_users(blocked_id);
create index idx_group_chats_tag on public.group_chats(tag_id, status);
create index idx_group_chats_channel on public.group_chats(channel_id, status);
create index idx_group_infos_group on public.group_infos(group_id);
create index idx_group_infos_info on public.group_infos(info_id);
create index idx_group_members_group_user on public.group_members(group_id, user_id);
create index idx_group_messages_group_created on public.group_messages(group_id, created_at);

create trigger conversations_touch before update on public.conversations for each row execute function public.touch_updated_at();
create trigger group_chats_touch before update on public.group_chats for each row execute function public.touch_updated_at();

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.blocked_users enable row level security;
alter table public.message_reports enable row level security;
alter table public.group_chats enable row level security;
alter table public.group_infos enable row level security;
alter table public.group_members enable row level security;
alter table public.group_messages enable row level security;
alter table public.group_join_requests enable row level security;
alter table public.group_reports enable row level security;

create policy "conversations member admin select" on public.conversations for select using (
  publisher_id = auth.uid() or initiator_id = auth.uid() or private.is_admin()
);
create policy "conversations initiator insert" on public.conversations for insert with check (
  auth.uid() = initiator_id
  and public.can_create_conversation(info_id, publisher_id, initiator_id)
  and public.private_daily_contact_count(auth.uid()) < 20
);
create policy "conversations member update" on public.conversations for update using (
  publisher_id = auth.uid() or initiator_id = auth.uid() or private.is_admin()
) with check (
  publisher_id = auth.uid() or initiator_id = auth.uid() or private.is_admin()
);
create policy "conversations admin delete" on public.conversations for delete using (private.is_admin());

create policy "messages member admin select" on public.messages for select using (
  public.is_conversation_member(conversation_id) or private.is_admin()
);
create policy "messages member insert" on public.messages for insert with check (
  public.can_send_private_message(conversation_id, sender_id, receiver_id)
  and public.private_minute_message_count(auth.uid()) < 5
);
create policy "messages member update read" on public.messages for update using (
  receiver_id = auth.uid() or private.is_admin()
) with check (
  receiver_id = auth.uid() or private.is_admin()
);
create policy "messages admin delete" on public.messages for delete using (private.is_admin());

create policy "blocked own select" on public.blocked_users for select using (blocker_id = auth.uid() or blocked_id = auth.uid() or private.is_admin());
create policy "blocked own insert" on public.blocked_users for insert with check (blocker_id = auth.uid());
create policy "blocked own delete" on public.blocked_users for delete using (blocker_id = auth.uid() or private.is_admin());

create policy "message reports participant insert" on public.message_reports for insert with check (
  reporter_id = auth.uid()
  and exists(select 1 from public.messages where id = message_id and public.is_conversation_member(conversation_id))
);
create policy "message reports admin select" on public.message_reports for select using (private.is_admin());
create policy "message reports admin update" on public.message_reports for update using (private.is_admin()) with check (private.is_admin());

create policy "group chats active readable" on public.group_chats for select using (
  status = 'active' or creator_id = auth.uid() or private.is_admin()
);
create policy "group chats authenticated insert" on public.group_chats for insert with check (
  creator_id = auth.uid() and public.group_daily_create_count(auth.uid()) < 5
);
create policy "group chats owner admin update" on public.group_chats for update using (
  creator_id = auth.uid() or public.is_group_role(id, array['owner', 'admin']) or private.is_admin()
) with check (
  creator_id = auth.uid() or public.is_group_role(id, array['owner', 'admin']) or private.is_admin()
);
create policy "group chats admin delete" on public.group_chats for delete using (private.is_admin());

create policy "group infos active readable" on public.group_infos for select using (
  exists(select 1 from public.group_chats where id = group_id and status = 'active') or private.is_admin()
);
create policy "group infos owner admin insert" on public.group_infos for insert with check (
  public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
);
create policy "group infos owner admin delete" on public.group_infos for delete using (
  public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
);

create policy "group members same group select" on public.group_members for select using (
  public.is_active_group_member(group_id) or user_id = auth.uid() or private.is_admin()
);
create policy "group members self join insert" on public.group_members for insert with check (
  user_id = auth.uid()
  and status in ('active', 'pending')
  and not exists (
    select 1 from public.group_members existing
    where existing.group_id = group_id
      and existing.user_id = auth.uid()
      and existing.status in ('removed', 'banned')
  )
);
create policy "group members owner admin update" on public.group_members for update using (
  public.is_group_role(group_id, array['owner', 'admin']) or user_id = auth.uid() or private.is_admin()
) with check (
  public.is_group_role(group_id, array['owner', 'admin']) or user_id = auth.uid() or private.is_admin()
);
create policy "group members owner admin delete" on public.group_members for delete using (
  public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
);

create policy "group messages active member select" on public.group_messages for select using (
  public.is_active_group_member(group_id) or private.is_admin()
);
create policy "group messages active member insert" on public.group_messages for insert with check (
  sender_id = auth.uid()
  and public.is_active_group_member(group_id)
  and public.group_minute_message_count(auth.uid()) < 10
);
create policy "group messages owner admin update" on public.group_messages for update using (
  sender_id = auth.uid() or public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
) with check (
  sender_id = auth.uid() or public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
);
create policy "group messages admin delete" on public.group_messages for delete using (private.is_admin());

create policy "group join requests own insert" on public.group_join_requests for insert with check (requester_id = auth.uid());
create policy "group join requests visible" on public.group_join_requests for select using (
  requester_id = auth.uid() or public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
);
create policy "group join requests owner admin update" on public.group_join_requests for update using (
  public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
) with check (
  public.is_group_role(group_id, array['owner', 'admin']) or private.is_admin()
);

create policy "group reports member insert" on public.group_reports for insert with check (
  reporter_id = auth.uid() and (public.is_active_group_member(group_id) or private.is_admin())
);
create policy "group reports admin select" on public.group_reports for select using (private.is_admin());
create policy "group reports admin update" on public.group_reports for update using (private.is_admin()) with check (private.is_admin());
