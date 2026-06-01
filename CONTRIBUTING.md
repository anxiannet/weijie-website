# Contributing

维界目前是 MVP。协作时请优先保护简单清晰的产品结构：`Channel -> Tag -> Info`。

## Local Setup

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open `http://127.0.0.1:3000`.

## Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is optional. Without Supabase variables, the app should continue to show mock content.

## Checks

Run before pushing:

```bash
npm run lint
npm run build
```

If the dev server was running during `npm run build`, restart it before testing in the browser.

## Development Rules

- Keep MVP scope narrow.
- Use `infos` for rentals, secondhand, services, food, activities, guides, news, and questions.
- Do not add dedicated vertical tables unless the product direction explicitly changes.
- Keep service-role Supabase operations inside server-side code.
- Update docs when schema, product scope, or operational flow changes.

## Pull Request Notes

Include:

- What changed
- Why it changed
- How it was tested
- Any Supabase migration or seed impact

