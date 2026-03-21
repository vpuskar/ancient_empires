# Ancient Empires — Project Context for Claude Code

## Stack

Next.js 16 (App Router), TypeScript strict, Supabase, Tailwind CSS v4,
Leaflet + React-Leaflet, D3.js + Observable Plot, Framer Motion, Zustand, next-intl

## Architecture — CRITICAL

Multi-tenant single codebase. Empire = data record (empire_id), NOT a separate app.
Never build empire-specific components — every component accepts an `empire` config prop.

empire_id mapping:

- 1 = Roman Empire (slug: 'roman', #8B0000, 509 BC – 476 AD)
- 2 = Chinese Empire (slug: 'chinese', #DE2910, 221 BC – 1912 AD)
- 3 = Japanese Empire (slug: 'japanese', #BC002D, 660 BC – 1945 AD)
- 4 = Ottoman Empire (slug: 'ottoman', #1A6B3A, 1299 – 1922 AD)

## Routing

All pages under /[empire]/ dynamic segment.
Compare page: /compare/personality (cross-empire quiz)

## Branching — CRITICAL

main → develop → feature/_
NEVER merge directly into main.
feature/_ → develop (test on Vercel preview) → main → auto Vercel deploy

## AI Tools (v1.4)

- Claude Code (terminal): import scripts, SEO, i18n, format transformation
- Lovable: UI components
- Claude Haiku API: batch content (quiz questions, ruler bios)
- Dependabot: dependency updates weekly (npm + GitHub Actions), PRs target develop

## Database Schema (Supabase)

Tables: empires, rulers, provinces, places, events, battles,
empire_extent, quiz_questions, chapters, analytics_cache
Materialised view: search_index

Key convention: negative integers for BC dates (-117 = 117 BC)

## Security — CRITICAL

- SUPABASE*SERVICE_ROLE_KEY → server-side only, never NEXT_PUBLIC*
- NEXT_PUBLIC_SUPABASE_ANON_KEY → client-safe (RLS enforces access)
- Rate limiting: active from Phase 0 (proxy.ts — Upstash Redis tiered)
- RLS enabled on ALL tables before any data import
- All AI/Claude API keys: server-side Route Handlers only
- Env vars validated at startup via Zod (lib/env.ts) — throws on missing/invalid

## Code Quality

- ESLint v9 flat config: next/core-web-vitals + @typescript-eslint/strict + prettier
- Prettier: singleQuote true, trailingComma es5
- Husky pre-commit hook: eslint --fix + prettier --write on .ts/.tsx; prettier on .json/.md/.css
- CI: GitHub Actions on PR to main/develop — lint → type-check → test → build
- `npm run lint` / `npm run type-check` / `npm run test` / `npm run format`

## Infrastructure

- Rate limiting: Upstash Redis, sliding window, two tiers:
  - standard /api/\*: 100 req/60s per IP
  - expensive /api/personality/og + /api/quiz/calculate: 15 req/60s per IP
- Supabase CLI: installed, project linked (ref: fvjbjnehupqdcwlodkpq)
- Migrations: supabase/migrations/ — run `supabase db push` to apply
- Admin cron: /api/admin/backup — Bearer CRON_SECRET, runs Monday 03:00 UTC via Vercel cron
- Sentry: @sentry/nextjs, tracesSampleRate 0.1, enabled in production only
- OG fallback: /public/og-fallback.png (1200×630)

## Testing

- Vitest (environment: node), `npm run test` → `vitest run`
- tests/smoke.test.ts: env validation (4 tests — valid, missing var, bad URL, short secret)
- Playwright: planned for Phase 2 (E2E)

## Fetch Caching Policy

- Static data (empire configs, rulers): `revalidate: 86400` (24h)
- Semi-static (events, places): `revalidate: 3600` (1h)
- Dynamic (quiz results, analytics): `cache: 'no-store'`

## GeoJSON

GeoJSON files NEVER go into the database.
Location: /public/geojson/
Max size: 200KB per file (simplify at mapshaper.org before saving)

## Current Phase

Phase 1 — Data Foundation: Roman Empire (Week 3-4)
Status: NOT STARTED

## What is complete

### Phase 0 — Foundation (Week 1-2) ✓

- Supabase project created with full schema (10 tables + RLS + user_roles)
- All 4 empires seeded in empires table
- Next.js 16 project initialized (TypeScript strict, Tailwind v4)
- lib/supabase/client.ts and server.ts (using env from lib/env.ts)
- lib/empires/config.ts with EMPIRE_CONFIGS and getEmpireBySlug()
- app/[empire]/page.tsx dynamic routing (returns 404 for unknown slugs)
- app/page.tsx landing page with 4 empire cards
- Vercel production deployment live at ancient-empires.vercel.app
- GitHub: main, develop branches; branch protection on main

### Phase 0 v1.4 additions ✓

- proxy.ts: Upstash Redis tiered rate limiting
- lib/env.ts: Zod validation for all env vars, throws at startup
- lib/errors.ts: AppError class with code/statusCode + toApiError()
- lib/services/rulers.ts, places.ts, quiz.ts: CRUD filtered by empire_id
- ESLint v9 + Prettier + husky pre-commit hook
- Vitest + tests/smoke.test.ts (4 passing)
- GitHub Actions CI: .github/workflows/ci.yml
- Dependabot: .github/dependabot.yml (npm + Actions, weekly, Monday)
- Sentry: sentry.client.config.ts + sentry.server.config.ts + app/error.tsx
- OG fallback: public/og-fallback.png + public/og-fallback.svg
- Supabase CLI linked, migration placeholder committed
- vercel.json: weekly backup cron (Monday 03:00 UTC)
- app/api/admin/backup/route.ts: Bearer CRON_SECRET auth

## What is in progress

(nothing — Phase 1 not yet started)

## Do NOT change without consultation

- Supabase table schema (migrations are final once data is imported)
- empire_id values (1=Roman, 2=Chinese, 3=Japanese, 4=Ottoman)
- EMPIRE_CONFIGS in lib/empires/config.ts
- RLS policies on all tables
- GeoJSON max size limit of 200KB

## Key decisions & why

- Manual CSV import preferred over scripts: simpler, no Node.js needed for sources with Export buttons
- OG image cache (Supabase Storage) mandatory: prevents 2s render on every Twitter/WhatsApp share
- Rate limiting from Phase 0: single Reddit post can exhaust Supabase free tier without it
- Upstash Redis for rate limiting: in-memory Map resets on Vercel cold starts; Redis is persistent
- proxy.ts (not middleware.ts): Next.js 16 renamed the file convention
- ESLint v9 flat config (eslint.config.mjs): v9 dropped legacy .eslintrc support; .eslintrc.json kept as placeholder
- @typescript-eslint/strict: no-non-null-assertion resolved via env validation (lib/env.ts), not eslint-disable
- lib/services/\* pattern: API routes must never call Supabase directly
- Next.js 16 installed (not 15) — same App Router architecture
- Tailwind v4 installed — no tailwind.config.ts needed, config in CSS
- NEXT*PUBLIC_SENTRY_DSN added alongside SENTRY_DSN: DSN is not secret, browser needs NEXT_PUBLIC* prefix
