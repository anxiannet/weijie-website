# Supabase Runbook

## Project

The current Supabase project ref used locally is visible in `.env.local` as the host prefix of `NEXT_PUBLIC_SUPABASE_URL`.

Do not commit `.env.local`.

## Migrations

Migration files:

- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_admin_ai_monitoring.sql`

Seed file:

- `supabase/seed.sql`

The remote database has already been initialized with these migrations and seed data during MVP setup.

## Tables

Core:

- `profiles`
- `channels`
- `tags`
- `infos`
- `info_tags`
- `comments`
- `saved_items`
- `reports`

Monitoring/admin:

- `search_logs`
- `page_views`
- `moderation_queue`
- `ai_drafts`
- `admin_tasks`

## RLS Expectations

- `channels` and `tags`: public read, admin write.
- `infos`: approved and published content is public; authors/admins can see their own/admin content.
- `comments`: approved public read; authenticated insert.
- `saved_items`: owner-only.
- `reports`: authenticated create; admin read/update.
- monitoring/admin tables: insert where needed, admin read.

Admin checks use `private.is_admin()`.

## Applying Schema Changes

Preferred path:

1. Write a migration under `supabase/migrations`.
2. Apply it with the Supabase MCP/app migration tool, or paste into Supabase SQL Editor if tooling is unavailable.
3. If PostgREST cannot see a new table immediately, run:

```sql
notify pgrst, 'reload schema';
```

4. Verify table counts or a targeted select.
5. Run `npm run lint` and `npm run build`.

## Useful Verification Queries

```sql
select
  (select count(*) from public.channels) as channels,
  (select count(*) from public.tags) as tags,
  (select count(*) from public.infos) as infos,
  (select count(*) from public.info_tags) as info_tags,
  (select count(*) from public.search_logs) as search_logs,
  (select count(*) from public.page_views) as page_views;
```

```sql
select title, moderation_status, created_at
from public.infos
order by created_at desc
limit 10;
```

## Publishing

`POST /api/infos` uses `SUPABASE_SERVICE_ROLE_KEY` on the server to create pending infos and tag links.

Do not move service-role writes into client components.

## Common Issues

### `PGRST205 Could not find table`

The table exists but PostgREST schema cache has not refreshed.

Run:

```sql
notify pgrst, 'reload schema';
```

Then restart the local dev server.

### Missing `.next` Chunk

If browser shows errors like `Cannot find module './276.js'`, stop dev server, delete `.next`, and restart:

```bash
rm -rf .next
npm run dev -- --hostname 127.0.0.1 --port 3000
```

