# AGENTS.md

This file gives coding agents the project context and guardrails for working on Weijie.

## Project

- Product name: 维界 Weijie
- Repository: `anxiannet/weijie-website`
- Purpose: a Singapore Chinese local-life content community.
- MVP shape: `Channel -> Tag -> Info`.
- MVP principle: keep all complex verticals inside `infos` until a tag has enough real demand to justify a dedicated module.

Do not turn the MVP into a full marketplace, rental platform, expert platform, merchant platform, appointment system, payment system, private messaging system, group chat system, or subject/topic system unless explicitly asked.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, Storage-ready
- Vercel-friendly deployment
- Mock data fallback when Supabase environment variables are missing or unavailable

## Useful Commands

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
npm run lint
npm run build
```

After `npm run build`, restart the dev server before browser testing. Next may rewrite `.next` chunks during builds, which can confuse a running dev server.

## Environment

Required for real Supabase access:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is optional. If it is absent, AI draft generation must use the mock template.

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client components. Only use it in server routes or trusted server utilities.

## Key Files

- `src/lib/data.ts`: data access layer. Prefer Supabase first, fall back to mock data.
- `src/data/mockData.ts`: mock channels, tags, infos, and comments.
- `src/lib/supabase/client.ts`: Supabase browser, server, and service clients.
- `src/lib/classifier/classifyInfo.ts`: rule-based info classifier.
- `src/lib/ai/generateInfoDraft.ts`: AI/mock AI info draft generator.
- `src/app/api/infos/route.ts`: publish API that writes pending infos and info_tags.
- `src/app/api/ai/draft/route.ts`: AI draft API.
- `supabase/migrations/001_init.sql`: core content tables and RLS.
- `supabase/migrations/002_admin_ai_monitoring.sql`: search, page view, moderation, AI, and admin task tables.
- `supabase/seed.sql`: initial channels, tags, and 40 seed infos.
- `docs/MVP.md`, `docs/DATA_MODEL.md`, `docs/ADMIN.md`: product and schema context.

## Data Model Rules

The core tables are:

- `channels`: manually maintained top-level categories.
- `tags`: topic-like labels, linked to channels.
- `infos`: all user/admin/AI content. This is the main MVP content table.
- `info_tags`: many-to-many relation between infos and tags.

Do not add vertical-specific tables like `rental_listings`, `marketplace_items`, `experts`, `restaurants`, or `businesses` during MVP work unless the user explicitly changes the product direction.

## Supabase Rules

- Keep RLS enabled on all public tables.
- Public reads should only expose approved and published content where appropriate.
- Ordinary user publishes should enter `moderation_status = 'pending'`.
- AI generated content must enter `ai_drafts` before becoming an `info`.
- Use `private.is_admin()` for admin checks, not user-editable metadata.
- Keep service-role writes on the server only.

If schema changes are needed:

1. Update or add a migration under `supabase/migrations`.
2. Update `docs/DATA_MODEL.md` if the schema meaning changes.
3. Update mock data or data access code if the frontend depends on the new fields.
4. Run `npm run lint` and `npm run build`.

## Frontend Rules

- Mobile first.
- Main color: `#008080`.
- Keep the experience close to a practical Xiaohongshu-style local info feed, but not over-entertained.
- Use cards for repeated content items, not for every page section.
- Keep UI direct and task-oriented.
- Bottom navigation is currently mobile-only: 首页, 搜索, 发布, 我的.

## Current Behavior

- Public pages read Supabase when configured and fall back to mock data if unavailable.
- `POST /api/infos` creates a pending info and links matched tags.
- Frontend publish flow is real enough for MVP, but Auth ownership is still pending.
- Admin pages currently mostly use mock/derived data and need real moderation actions next.

## Verification Checklist

Before finishing substantial work:

```bash
npm run lint
npm run build
```

For local browser checks:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Verify at least:

- `/`
- `/search?q=NTU`
- `/publish`
- `/admin/moderation` when touching admin work

## Git Hygiene

- Do not commit `.env.local`.
- Do not silently stage unrelated user changes.
- There may be user changes in the worktree. Work around them and ask only if they block the task.
- Use concise commit messages, for example `Connect Supabase data and publishing`.

