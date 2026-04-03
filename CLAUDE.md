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

## Empire Config — Extended Fields

`lib/empires/config.ts` exports `EMPIRE_CONFIGS` with these fields per empire:
id, name, nativeName, capital, slug, color, start, end, startYear, endYear

- `nativeName`: display name in native language (e.g. "Imperium Romanum")
- `capital`: primary capital city name (e.g. "ROMA", "CHANG'AN")
- `startYear` / `endYear`: same as start/end, added for semantic clarity

## Routing

All pages under /[empire]/ dynamic segment.
Compare page: /compare/personality (cross-empire quiz)

Current empire pages:
- /[empire]/ — Overview (landing)
- /[empire]/rulers — Rulers encyclopaedia
- /[empire]/map — Interactive Leaflet map
- /[empire]/timeline — Horizontal events timeline
- /[empire]/chapters — Storytelling chapters
- /[empire]/analytics — Analytics dashboard (Phase 3)
- /[empire]/territorial — Territorial timeline (Phase 3)

## Branching — CRITICAL

main → develop → feature/*
NEVER merge directly into main.
feature/* → develop (test on Vercel preview) → main → auto Vercel deploy

## AI Tools (v1.4)

- Claude (chat): architecture, specs, prompts, code review, SQL
- OpenAI Codex (gpt-5.4): primary coding agent, uses AGENTS.md
- Claude Code (terminal): import scripts, SEO, i18n, format transformation
- Claude Haiku API: batch content (quiz questions, ruler bios)
- Dependabot: dependency updates weekly (npm + GitHub Actions), PRs target develop

## Database Schema (Supabase)

Tables: empires, rulers, provinces, places, events, battles,
empire_extent, quiz_questions, chapters, analytics_cache
Materialised view: search_index

Key convention: negative integers for BC dates (-117 = 117 BC)

### empire_extent actual years (Roman, empire_id=1):
-500, -200, -1, 100, 200, 400
(NOT -27 and 117 — enrichment mappings must match these exact DB values)

## Security — CRITICAL

- SUPABASE_SERVICE_ROLE_KEY → server-side only, never NEXT_PUBLIC_
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
  - standard /api/*: 100 req/60s per IP
  - expensive /api/personality/og + /api/quiz/calculate: 15 req/60s per IP
- Supabase CLI: installed, project linked (ref: fvjbjnehupqdcwlodkpq)
- Migrations: supabase/migrations/ — run `supabase db push` to apply
- Admin cron: /api/admin/backup — Bearer CRON_SECRET, runs Monday 03:00 UTC via Vercel cron
- Sentry: @sentry/nextjs, tracesSampleRate 0.1, enabled in production only
- OG fallback: /public/og-fallback.png (1200×630)

## Testing

- Vitest (environment: node), `npm run test` → `vitest run`
- tests/smoke.test.ts: env validation (4 tests — valid, missing var, bad URL, short secret)
- Playwright: 4 critical path E2E tests passing

## Fetch Caching Policy

- Static data (empire configs, rulers): `revalidate: 86400` (24h)
- Semi-static (events, places, empire_extent): `revalidate: 3600` (1h)
- Dynamic (quiz results, analytics): `cache: 'no-store'` or `dynamic = 'force-dynamic'`

**Note:** Analytics dashboard uses `force-dynamic` (data changes on import).
Territorial timeline uses `revalidate: 3600` (semi-static empire_extent data).

## GeoJSON

GeoJSON files NEVER go into the database.
Location: /public/geojson/
Max size: 200KB per file (simplify at mapshaper.org before saving)

Files (Roman Empire):

- roman_bc500.geojson — 500 BC, early Kingdom
- roman_bc200.geojson — 200 BC, after Second Punic War
- roman_bc1.geojson — 1 BC, late Republic
- roman_100.geojson — 100 AD, near peak (Trajan)
- roman_200.geojson — 200 AD, Severan stable maximum
- roman_400.geojson — 400 AD, post-division

## Current Phase

Phase 3 — Roman Empire Complete (Week 9-11)
Status: IN PROGRESS — 2 of 5 features complete

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

### Phase 1 — Data Foundation (Week 3-4) ✓

- 68 rulers, 7,608 places, 101 battles, 52 provinces
- 4,377 quiz questions, 6 GeoJSON territorial snapshots
- 6 empire_extent rows, 98 events (62 with ruler_id)
- 7 Markdown chapters (mid-detail)

### Phase 2 — Roman Empire MVP (Week 5-8) ✓

- Empire selector landing page
- Rulers encyclopaedia
- Interactive Leaflet map (dynamic import, Positron tiles)
- Horizontal timeline (autoplay, category filters)
- Storytelling chapters (scroll-driven, useReveal hook)
- PostHog analytics (US Cloud, autocapture enabled)
- Error reporting (ReportError → GitHub Issues)
- Lighthouse: Performance 89, Accessibility 100, Best Practices 100, SEO 60

### Phase 3 — Roman Empire Complete (Week 9-11) — IN PROGRESS

#### ✓ feature/analytics-charts (merged to develop)
- 6 D3.js charts: Dynasty bar, Events donut, Battle outcomes, Activity by century, Territorial extent, Places treemap
- lib/services/analytics.ts: server-side data fetch + transformation + typed DTOs
- lib/types/analytics.ts: full TypeScript interfaces
- app/[empire]/analytics/page.tsx: server component, `force-dynamic`
- All charts use empire.color from config (multi-tenant ready)
- Null/unknown handling for dynasty, category, outcome, place type
- Places chart uses actual DB schema values: city, fort, temple, battle_site, road, port, palace, other
- Framer Motion stagger entrance animation
- "Analytics" link added to EmpireSectionNav

#### ✓ feature/territorial-timeline (merged to develop)
- Radial concentric circle visualization (D3, animated rings)
- lib/services/territorial.ts: server-side fetch from empire_extent + curated enrichment data
- lib/types/territorial.ts: TimelineSnapshot, TimelineMarker, TerritorialTimelineData
- Enrichment mapping keyed by actual DB years (-500, -200, -1, 100, 200, 400)
- Generic fallback for unmatched years (no crash on missing enrichment)
- Timeline scrubber with snapshot dots, marker pips, ruler pills, active track
- Story strip with narrative per snapshot
- Adaptive context panel: era info, territory bar, provinces list (expand/collapse)
- Desktop: radial + sidebar layout. Mobile: stacked with accordion panel
- Autoplay (2500ms interval), keyboard navigation (arrows + space)
- Framer Motion page-load entrance, CSS transitions for snapshot changes
- `revalidate: 3600` (semi-static)
- "Territorial" link added to EmpireSectionNav
- lib/empires/config.ts extended: nativeName, capital, startYear, endYear fields

#### ⬜ feature/quiz-module — NOT STARTED
- Quiz flow, timer, score
- 4,377 questions ready in DB

#### ⬜ feature/seo-performance — NOT STARTED
- Sitemap, JSON-LD, OG
- Target: SEO 60 → 90+

#### ⬜ feature/personality-quiz-roman — NOT STARTED
- Personality quiz UI + cosine similarity
- 6 rulers: Augustus, Julius Caesar, Marcus Aurelius, Trajan, Nero, Caligula

## Service Layer Pattern

All Supabase access goes through `lib/services/*.ts`. API routes and page.tsx server components import services, never call Supabase directly.

Current services:
- lib/services/rulers.ts
- lib/services/places.ts
- lib/services/quiz.ts
- lib/services/stats.ts
- lib/services/analytics.ts (Phase 3)
- lib/services/territorial.ts (Phase 3)

Pattern:
```typescript
import { createClient } from '@/lib/supabase/server';
import { AppError } from '@/lib/errors';

export async function getSomething(empireId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('table').select('*').eq('empire_id', empireId);
  if (error) throw new AppError('CODE', error.message);
  return data;
}
```

## Charting — D3.js

All charts use D3.js + Observable Plot. Recharts is NOT used.
D3 + React integration pattern:
- `'use client'` components
- `useRef<SVGSVGElement>` for container
- `useEffect` with `svg.selectAll('*').remove()` cleanup before re-render
- Responsive via SVG `viewBox`, never fixed pixel dimensions
- `empire.color` passed as prop, never hardcoded

## Navigation

Empire section nav (`EmpireSectionNav.tsx`) links:
Overview, Rulers, Map, Timeline, Territorial, Chapters, Analytics

## Data completeness — Roman Empire

| Table          | Rows  | Key fields populated                                   |
| -------------- | ----- | ------------------------------------------------------ |
| empires        | 4     | all 4 empires seeded                                   |
| rulers         | 68    | name, dynasty, reign_start/end, bio_short, image_url   |
| provinces      | 52    | name, centroid lat/lng                                  |
| places         | 7,608 | lat/lng, type, province_id, founded_year                |
| battles        | 101   | lat/lng, outcome, opposing_force, place_id, casualties  |
| events         | 98    | year, category, significance (1-5), ruler_id (62/98)    |
| chapters       | 7     | slug, title, content_md (Markdown), period_start/end    |
| empire_extent  | 6     | year, geojson_url, area_km2, notes                      |
| quiz_questions | 4,377 | (full set for Roman Empire)                             |

## Known technical debt

- iOS Safari test deferred (not yet verified)
- SEO score 60 — to be addressed in Phase 3 feature/seo-performance
- Playwright quiz test deferred (quiz module not yet built)
- Server-side PostHog capture deferred (quiz_completed, share_clicked events)
- CI env vars use mock values — consider GitHub Secrets for real keys
- Province polygon boundaries deferred (nearest-centroid used for MVP)
- 2 pre-existing lint warnings in app/page.tsx and app/[empire]/timeline/page.tsx (custom font usage)

## Key decisions & why

- Manual CSV import preferred over scripts: simpler for sources with Export buttons
- OG image cache (Supabase Storage) mandatory: prevents 2s render on every share
- Rate limiting from Phase 0: prevents Supabase free tier exhaustion
- Upstash Redis for rate limiting: in-memory Map resets on Vercel cold starts
- proxy.ts (not middleware.ts): Next.js 16 renamed the file convention
- ESLint v9 flat config: v9 dropped legacy .eslintrc support
- lib/services/* pattern: routes never call Supabase directly
- D3.js for all charts (NOT Recharts): matches spec, single charting library
- Analytics page: force-dynamic (data changes on import, not suitable for ISR)
- Territorial page: revalidate 3600 (semi-static empire_extent data)
- Territorial enrichment keyed by actual DB years: -500, -200, -1, 100, 200, 400
- Client components must never import lib/env.ts: Zod validates server-only env vars
- React hooks must be declared before any conditional returns
- Codex prompts split into 3-4 focused steps: reduces errors, enables incremental verification

## Do NOT change without consultation

- Supabase table schema (migrations are final once data is imported)
- empire_id values (1=Roman, 2=Chinese, 3=Japanese, 4=Ottoman)
- EMPIRE_CONFIGS in lib/empires/config.ts
- RLS policies on all tables
- GeoJSON max size limit of 200KB
- D3.js as the charting library (do not introduce Recharts)
- Service layer pattern (all DB access through lib/services/)
