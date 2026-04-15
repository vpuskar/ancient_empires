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
- /[empire]/quiz — Knowledge quiz (Phase 3)
- /[empire]/personality — Personality quiz (Phase 3)

API routes:

- /api/quiz/questions — POST, fetches random questions by empire+difficulty+category

Auto-generated routes:

- /sitemap.xml — dynamic sitemap (all empire pages)
- /robots.txt — crawler rules (allow all, disallow /api/)

## Branching — CRITICAL

main → develop → feature/_
NEVER merge directly into main.
feature/_ → develop (test on Vercel preview) → main → auto Vercel deploy

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

### quiz_questions.difficulty levels:

- 1 = Plebs (basic common knowledge) — ~1,091 questions (25%)
- 2 = Legionarius (requires Roman history knowledge) — ~1,756 questions (40%)
- 3 = Senator (specific dates/details/context) — ~1,092 questions (25%)
- 4 = Imperator (obscure, specialist-level) — ~438 questions (10%)

### quiz_questions.category values (Roman Empire):

- culture: 2,889
- politics: 383
- rulers: 376
- religion: 301
- geography: 236
- battles: 192

### quiz_questions.correct column:

CHAR(1) — values 'A', 'B', 'C', 'D'. Maps to option index: A=0, B=1, C=2, D=3.

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
- Playwright: 4 critical path E2E tests passing

## Fetch Caching Policy

- Static data (empire configs, rulers, personality config): `revalidate: 86400` (24h)
- Semi-static (events, places, empire_extent, quiz config): `revalidate: 3600` (1h)
- Dynamic (quiz questions, quiz results, analytics): `cache: 'no-store'` or `dynamic = 'force-dynamic'`

**Per-page caching:**

- Analytics dashboard: `force-dynamic`
- Territorial timeline: `revalidate: 3600`
- Quiz page: `revalidate: 3600` (config), API route `no-store` (questions)
- Personality quiz: `revalidate: 86400` (static config)

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

Files (Ottoman Empire):
- ottoman_1400.geojson — 1400, early Bayezid I expansion
- ottoman_1500.geojson — 1500, post-Constantinople consolidation
- ottoman_1600.geojson — 1600, near peak after Suleiman
- ottoman_1700.geojson — 1700, post-Vienna contraction
- ottoman_1800.geojson — 1800, reform era decline
- ottoman_1900.geojson — 1900, pre-collapse final decades

## Current Phase

Phase 4 — Ottoman Empire (Week 12-14)
Status:  COMPLETE — All data imported, all pages functional, personality quiz live.

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

### Phase 3 — Roman Empire Complete (Week 9-11) ✓

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

#### ✓ feature/quiz-module (merged to develop)

- 4-tier difficulty system: Plebs (30s, ×1), Legionarius (20s, ×1.5), Senator (15s, ×2), Imperator (10s, ×3)
- 6 categories from DB: culture, politics, rulers, religion, geography, battles
- Difficulty select → Category select → Loading → Playing → Score Card flow
- lib/types/quiz.ts: QuizDifficultyLevel, QuizCategory, QuizQuestion, QuizConfig
- lib/config/quiz-difficulties.ts: static gameplay config (timer, multiplier per level)
- lib/config/quiz-ranks.ts: rank calculation (Tiro → Miles → Centurion → Praetor → Triumphator)
- lib/services/quiz.ts: getQuizConfig (semi-static) + getQuizQuestions (dynamic, Fisher-Yates shuffle)
- app/api/quiz/questions/route.ts: POST, Zod validated, returns bare QuizQuestion[] array, no-store
- app/[empire]/quiz/page.tsx: server component, revalidate 3600
- QuizGame.tsx: state machine with ref-guarded timer (prevents double-reveal, double-advance, stale closures)
- QuestionScreen.tsx: presentational only, all game logic in QuizGame
- ScoreCard.tsx: animated score ring, Roman rank, weighted + raw stats, formatScore helper
- PostHog quiz_completed event with ref guard (fires exactly once per completion)
- Keyboard support: A/B/C/D and 1/2/3/4 keys
- quiz_questions.difficulty reclassified: all-2 → 4-tier (25/40/25/10% distribution)

#### ✓ feature/personality-quiz-roman (merged to develop)

- "Which Roman Ruler Are You?" — 8 questions, cosine similarity, 6 ruler results
- lib/types/personality.ts: PersonalityVector, PersonalityQuestion, RulerProfile, PersonalityConfig, PersonalityResult
- lib/config/personality/algorithm.ts: buildUserVector, cosineSimilarity (zero-vector guard), calculateResult
- lib/config/personality/roman.ts: 8 curated questions + 6 ruler profiles with 8-dimension vectors
- lib/config/personality/index.ts: multi-empire keying by empire_id (only Roman exists now)
- Cosine similarity normalized to 0-100: `((similarity + 1) / 2) * 100` — never negative matchPercent
- PersonalityConfig.displayName: "Roman" (not "Roman Empire") for clean user-facing copy
- app/[empire]/personality/page.tsx: server component, revalidate 86400, generateMetadata with displayName
- PersonalityQuiz.tsx: state machine (intro → playing → result), answerTimeoutRef with cleanup
- IntroScreen.tsx: ruler preview strip, "Reveal Your Ruler" CTA
- QuestionScreen.tsx + QuestionProgress.tsx: presentational, CSS key-based fade animation
- ResultScreen.tsx: animated ruler reveal (Framer Motion stagger), trait pills, match description
- MatchScores.tsx: 6 ruler bars with mounted-state CSS animation
- ShareButton.tsx: Web Share API → clipboard fallback → "Copy unavailable" graceful degradation
- PostHog personality_quiz_started + personality_quiz_completed events (ref guards)
- "Personality" link added to EmpireSectionNav
- Static config (not DB) — no Supabase queries, no API routes

#### ✓ feature/seo-performance (merged to develop)

- lib/seo/metadata.ts: buildMetadata + buildEmpirePageMetadata helpers (title, description, canonical, OG, Twitter)
- lib/seo/jsonld.ts: Organization, WebSite, BreadcrumbList, Quiz, Article JSON-LD builders
- lib/seo/json-ld-script.tsx: reusable server component for `<script type="application/ld+json">`
- app/sitemap.ts: dynamic sitemap with home + 4 empire overviews + 8 Roman sub-pages
- app/robots.ts: allow all, disallow /api/, link to sitemap
- generateMetadata on ALL routed pages with unique descriptions, canonical URLs, OG + Twitter cards
- metadataBase set in root layout (critical for OG image URL resolution)
- Root layout: `lang="en"` + viewport export
- Home page: Organization + WebSite JSON-LD
- Empire pages: BreadcrumbList JSON-LD (3-level breadcrumbs on sub-pages)
- Quiz/Personality pages: Quiz schema JSON-LD
- Chapters: Article schema JSON-LD
- Title ownership: buildMetadata returns final title, layout template does not double-append
- NEXT_PUBLIC_SITE_URL with fallback to production URL (not in Zod schema — optional)
- Target: Lighthouse SEO 90+ (up from 60)
- Home page Lighthouse recovery merged on develop: server-rendered hero, immediate visible `<h1>`, priority hero image, root `next/font` swap loading, and home-page metadata cleanup
- `AGENTS.md` now exists at repo root and should stay in sync with `CLAUDE.md`

### Phase 4 — Ottoman Empire (Week 12-14) ✓

#### ✓ Ottoman Data Import (complete)
- 37 sultans imported (Osman I through Abdulmejid II, empire_id=4)
- Name splitting: English name + Turkish native_name (Latin script, no RTL needed)
- death_cause mapped to DB enum: natural, assassination, illness, unknown
- bio_short smart-truncated to 300 chars at sentence boundaries
- Split reign periods resolved (Murad II, Mehmed II, Mustafa I): first start, last end
- 118 events with ruler_id mapping (86/87 original + expanded by Codex)
- Event categories mapped to DB CHECK constraint: political, military, cultural, religious
- 60 battles with lat/lng coordinates, outcomes, casualties, opposing forces
- 74 places: 34 cities, 12 forts, 12 mosques (temple), 7 ports, 6 palaces, 3 battle_sites
- 41 provinces (eyalets and vilayets) with established/dissolved years
- Province backfill: nearest-centroid SQL matching places to provinces
- 10 narrative chapters covering 1299-1924 (dollar-quoted SQL insert)
- 5,000 quiz questions imported
- 6 GeoJSON territorial snapshots (1400-1900) extracted from historical-basemaps
- 6 empire_extent rows with area_km2 estimates

#### ✓ Ottoman Personality Quiz (static config)
- lib/config/personality/ottoman.ts: 8 Ottoman-themed questions + 6 sultan profiles
- 6 results: Suleiman I, Mehmed II, Selim I, Bayezid II, Osman I, Murad I
- 8 dimensions: power_style, conflict, legacy, innovation, people_focus, risk, moral_framework, charisma
- Registered in lib/config/personality/index.ts (empire_id=4)
- displayName: "Ottoman"

#### ✓ Ottoman Integration (code)
- Ottoman added to EMPIRE_CONFIGS: id=4, slug='ottoman', color=#1A6B3A, 1299-1922
- nativeName: "Devlet-i Aliyye-i Osmâniyye", capital: "ISTANBUL"
- 'ottoman' added to FULL_CONTENT_SLUGS in app/sitemap.ts
- GeoJSON files committed to /public/geojson/ (ottoman_1400 through ottoman_1900)

#### ✓ Legacy Component Fix (multi-empire)
- LegacyRulersPage.tsx replaced with data-driven wrapper using getRulers(empire_id)
- LegacyTimelinePage.tsx replaced with data-driven wrapper using getEventsWithRulers(empire_id)
- Timeline category filters now derived from actual DB data (not hardcoded Roman categories)
- EventDetailCard.tsx recognizes 'religious' as first-class category
- AnalyticsDashboard category-neutral
- IntroScreen.tsx personality quiz uses empire-agnostic copy

#### ✓ Ottoman Territorial Enrichment
- lib/services/territorial.ts: Ottoman enrichment keyed by years 1400, 1500, 1600, 1700, 1800, 1900
- Each snapshot has era name, ruler, narrative
- Generic fallback still works for unmatched years

#### ✓ All Ottoman Pages Verified Working
- /ottoman — Overview with empire stats
- /ottoman/rulers — 37 sultans from DB
- /ottoman/map — Ottoman places on Leaflet map
- /ottoman/timeline — 118 events, data-driven category filters
- /ottoman/territorial — 6 snapshots with enrichment
- /ottoman/chapters — 10 chapters
- /ottoman/quiz — Ottoman questions from API
- /ottoman/personality — 6 sultan results
- /ottoman/analytics — Charts using empire.color #1A6B3A

## Service Layer Pattern

All Supabase access goes through `lib/services/*.ts`. API routes and page.tsx server components import services, never call Supabase directly.

Current services:

- lib/services/rulers.ts
- lib/services/places.ts
- lib/services/quiz.ts (Phase 3: getQuizConfig + getQuizQuestions)
- lib/services/stats.ts
- lib/services/analytics.ts (Phase 3)
- lib/services/territorial.ts (Phase 3)

Note: personality quiz does NOT use services — all data is static config in lib/config/personality/.

## Quiz Module Architecture

### State Machine

`QuizGame.tsx` is the orchestrator: difficulty → category → loading → playing → score.
All timer, reveal, advance, and score logic lives in QuizGame (NOT in child components).
Child components (QuestionScreen, QuizTimer, QuizProgress, ScoreCard) are presentational only.

### Timer Safety Pattern

- `isRevealedRef` prevents double-reveal
- `advanceTimeoutRef` stored and cleared on question change/unmount
- `timerIntervalRef` stored and cleared on reveal/unmount/screen change
- Functional state updates avoid stale closures in setTimeout callbacks
- Game state reset happens inline in fetch success handler, NOT in useEffect([screen])

### Question Fetching

- Config (category counts) fetched server-side in page.tsx (semi-static, revalidate 3600)
- Questions fetched client-side via POST /api/quiz/questions (dynamic)
- API returns bare QuizQuestion[] array (not wrapped)
- Fisher-Yates shuffle for unbiased randomness

## Personality Quiz Architecture

### Static Config (not DB)

- Questions + ruler profiles live in lib/config/personality/roman.ts
- Multi-empire keying via lib/config/personality/index.ts
- No Supabase queries, no API routes — pure client-side calculation

### Cosine Similarity

- 8 dimensions: power_style, conflict, legacy, innovation, people_focus, risk, moral_framework, charisma
- Normalized to 0-100: `((similarity + 1) / 2) * 100` — NEVER negative
- Zero-vector guard returns first ruler with 0% match

### DisplayName Pattern

- PersonalityConfig.displayName = "Roman" (not "Roman Empire")
- Used in titles and metadata for clean user-facing copy
- Does NOT modify global EmpireConfig

## SEO Architecture

### Metadata

- lib/seo/metadata.ts: centralized helpers, all pages import from here
- buildMetadata returns FINAL title (no double-suffix from layout template)
- Every page has: unique description, canonical URL, OG image, Twitter card
- NEXT_PUBLIC_SITE_URL optional, fallback to hardcoded production URL

### Structured Data

- JSON-LD injected via server component (no 'use client')
- Organization + WebSite on home only
- BreadcrumbList on all empire sub-pages
- Quiz schema on quiz + personality pages
- Article schema on chapters

### Sitemap

- Static generation via app/sitemap.ts
- Only includes pages with actual shipped content
- FULL_CONTENT_SLUGS controls which empires get sub-page entries

## Charting — D3.js

All charts use D3.js + Observable Plot. Recharts is NOT used.
D3 + React pattern: 'use client', useRef<SVGSVGElement>, useEffect with cleanup, responsive viewBox, empire.color as prop.

## Navigation

Empire section nav (`EmpireSectionNav.tsx`) links:
Overview, Rulers, Map, Timeline, Territorial, Chapters, Quiz, Analytics, Personality

## Data completeness — Roman Empire

| Table          | Rows  | Key fields populated                                   |
| -------------- | ----- | ------------------------------------------------------ |
| empires        | 4     | all 4 empires seeded                                   |
| rulers         | 68    | name, dynasty, reign_start/end, bio_short, image_url   |
| provinces      | 52    | name, centroid lat/lng                                 |
| places         | 7,608 | lat/lng, type, province_id, founded_year               |
| battles        | 101   | lat/lng, outcome, opposing_force, place_id, casualties |
| events         | 98    | year, category, significance (1-5), ruler_id (62/98)   |
| chapters       | 7     | slug, title, content_md (Markdown), period_start/end   |
| empire_extent  | 6     | year, geojson_url, area_km2, notes                     |
| quiz_questions | 4,377 | difficulty 1-4 (reclassified), 6 categories            |

## Data completeness — Ottoman Empire

| Table          | Rows  | Key fields populated                                    |
| -------------- | ----- | ------------------------------------------------------- |
| rulers         | 37    | name, native_name, dynasty, reign_start/end, bio_short  |
| events         | 118   | year, category, significance, ruler_id                  |
| battles        | 60    | lat/lng, outcome, opposing_force, casualties            |
| places         | 74    | lat/lng, type, province_id, founded_year                |
| provinces      | 41    | name, native_name, established, dissolved               |
| chapters       | 10    | slug, title, content_md (Markdown), period_start/end    |
| empire_extent  | 6     | year (1400-1900), geojson_url, area_km2                 |
| quiz_questions | 5,000 | difficulty 1-4, categories                              |
| GeoJSON files  | 6     | ottoman_1400 through ottoman_1900                       |
| personality    | 6     | sultan profiles, static config (not DB)                 |

## Known technical debt

- iOS Safari test deferred (not yet verified)
- Playwright quiz + personality E2E tests needed
- Server-side PostHog capture deferred (share_clicked event)
- CI env vars use mock values — consider GitHub Secrets for real keys
- Province polygon boundaries deferred (nearest-centroid used for MVP)
- 2 pre-existing lint warnings in app/page.tsx and app/[empire]/timeline/page.tsx (custom font usage)
- Quiz difficulty classification is heuristic-based — spot-check recommended
- Re-run Lighthouse on the deployed home page after the latest develop deploy to confirm recovered Performance / Accessibility / SEO scores
- Pre-existing D3 typing issues (Cannot find module 'd3' + implicit any) — not introduced by Phase 4
- .codex-worktrees/.next files cause repo-wide lint failures — gitignore recommended
- Landing page counters still hardcoded (Roman-only numbers) — should be data-driven or updated
- Quiz difficulty labels still Roman-themed for Ottoman (Plebs/Legionarius) — empire-aware labels deferred
- Home page Ottoman card may still show "Coming soon" — verify after merge to main

## Key decisions & why

- Manual CSV import preferred over scripts: simpler for sources with Export buttons
- OG image cache (Supabase Storage) mandatory: prevents 2s render on every share
- Rate limiting from Phase 0: prevents Supabase free tier exhaustion
- Upstash Redis for rate limiting: in-memory Map resets on Vercel cold starts
- proxy.ts (not middleware.ts): Next.js 16 renamed the file convention
- lib/services/\* pattern: routes never call Supabase directly
- D3.js for all charts (NOT Recharts): matches spec, single charting library
- Territorial enrichment keyed by actual DB years: -500, -200, -1, 100, 200, 400
- Client components must never import lib/env.ts
- Codex prompts split into 3-4 focused steps: reduces errors, enables incremental verification
- Quiz questions fetched via API route: user selects difficulty+category client-side
- Fisher-Yates shuffle: unbiased randomness for quiz question selection
- Quiz difficulty 4-tier reclassification: heuristic batch classifier, 25/40/25/10 distribution
- Quiz timer safety: ref guards prevent double-reveal/advance
- Personality quiz uses static config (not DB): curated content, no service layer needed
- Cosine similarity normalized to 0-100: prevents negative matchPercent in UI
- PersonalityConfig.displayName: avoids "Roman Empire Ruler" awkward copy
- SEO metadata centralized in lib/seo/: consistent titles, descriptions, OG across all pages
- SEO title ownership: helpers return final title, layout does not double-append
- JSON-LD as server components: no client JS overhead for structured data
- Sitemap only includes shipped content: FULL_CONTENT_SLUGS prevents empty page indexing
- Ottoman native names use Latin script (not Arabic) — no RTL handling needed
- Ottoman GeoJSON extracted from aourednik/historical-basemaps world files — single Ottoman polygon per year
- Death cause mapped: detailed causes (Typhus, Cirrhosis, etc.) → DB enum (illness, natural, assassination, unknown)
- Split reign sultans: first reign_start, last reign_end stored (Murad II: 1421-1451)
- Chapters via SQL INSERT with dollar-quoting ($$) — avoids apostrophe escaping issues in Markdown content
- Events category CHECK constraint: political/military/cultural/religious/economic/natural (different from quiz categories)
- Province backfill via nearest-centroid SQL (same pattern as Roman)
- Legacy components (LegacyRulersPage, LegacyTimelinePage) replaced with data-driven wrappers — multi-empire compatible

## Lighthouse scores (production — ancient-empires.vercel.app)
- Phase 3 final: Performance 96, Accessibility 100, Best Practices 96, SEO 100
- Fixed from Phase 2: NO_LCP error resolved (server-rendered hero, priority image, font display swap)
- SEO 100 achieved after adding app/robots.ts + app/sitemap.ts (were missing from repo)
- Note: Vercel preview URLs always show SEO 66-69 due to x-robots-tag: noindex header — always test on production URL

## On the Horizon — Phase 5+

Phase 5 — Chinese Empire (Week 15-17): CHGIS data, dynasty switcher
Phase 6 — Japanese Empire (Week 18-20): Rekichizu roads, gengo era conversion
Phase 7 — Compare + Polish (Week 21-24): cross-empire D3 widgets, OG image generation, i18n, admin UI

## Do NOT change without consultation

- Supabase table schema (migrations are final once data is imported)
- empire_id values (1=Roman, 2=Chinese, 3=Japanese, 4=Ottoman)
- EMPIRE_CONFIGS in lib/empires/config.ts
- RLS policies on all tables
- GeoJSON max size limit of 200KB
- D3.js as the charting library (do not introduce Recharts)
- Service layer pattern (all DB access through lib/services/)
- quiz_questions difficulty mapping (1=Plebs, 2=Legionarius, 3=Senator, 4=Imperator)
- Quiz API route response shape (bare QuizQuestion[] array)
- Quiz timer ref-guard pattern in QuizGame.tsx
- Personality cosine similarity normalization formula
- SEO title ownership model (helpers return final title)
- lib/seo/metadata.ts as single source for metadata helpers
