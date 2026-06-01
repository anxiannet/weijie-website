# Development Guide

## App Shape

维界是新加坡华人本地生活内容社区。第一版只做三层：

```text
Channel -> Tag -> Info
```

复杂需求先用 `infos` 承载。只有当某个 tag 下内容足够多，才考虑升级成独立系统。

## Directory Map

```text
src/app                 Next.js App Router pages and API routes
src/components          Reusable UI components
src/data/mockData.ts    Mock fallback data
src/lib/data.ts         Supabase-first data access with mock fallback
src/lib/supabase        Supabase clients
src/lib/classifier      Rule-based info classifier
src/lib/ai              AI/mock AI draft generation
src/types               Shared TypeScript types
supabase/migrations     SQL migrations
docs                    Product, schema, admin, and runbook docs
```

## Data Access

Use `src/lib/data.ts` for page data. It tries Supabase when env vars exist, and falls back to mock data if Supabase is missing or errors.

Public pages use `noStore()` so data is read at request time instead of baked into static output.

For service-role writes, use `getSupabaseServiceClient()` from `src/lib/supabase/client.ts` only in server routes.

## Publish Flow

Current MVP publish flow:

1. User fills `/publish`.
2. Client can run `classifyInfo`.
3. Client submits to `POST /api/infos`.
4. Server validates title/content.
5. Server finds selected channel by slug.
6. Server inserts `infos` with `moderation_status = 'pending'`.
7. Server links existing tags in `info_tags`.

Pending content is not shown in public feeds.

## Mock Fallback

Mock fallback is intentional and must be preserved. It lets the site render without Supabase for local demos, Vercel previews without secrets, and development during database outages.

When adding new fields to Supabase tables, update mock data and TypeScript types if frontend pages depend on those fields.

## Styling

- Tailwind CSS only unless a clear need appears.
- Main color: `#008080`.
- Mobile first.
- Keep information dense but readable.
- Avoid turning the product into a marketing landing page.

## Testing

Use:

```bash
npm run lint
npm run build
```

Smoke test:

```bash
curl -I http://127.0.0.1:3000/
curl -I 'http://127.0.0.1:3000/search?q=NTU'
curl -I http://127.0.0.1:3000/publish
```

