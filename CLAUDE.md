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
- `capital`: primary capital city name (e.g. "ROMA", "CHANGAN")
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

### empire_extent actual years (Ottoman, empire_id=4):

1400, 1500, 1600, 1700, 1800, 1900

### empire_extent actual years (Chinese, empire_id=2):

-1, 500, 700, 1100, 1500, 1800

### empire_extent actual years (Japanese, empire_id=3):

800, 1200, 1600, 1800, 1900, 1938
(No BC snapshots — source dataset has no Japan polygon before ~300 AD; 800 is earliest meaningful Yamato state polygon)

### quiz_questions.difficulty levels:

- 1 = Plebs (basic common knowledge) — ~25%
- 2 = Legionarius (requires history knowledge) — ~40%
- 3 = Senator (specific dates/details/context) — ~25%
- 4 = Imperator (obscure, specialist-level) — ~10%

### quiz_questions.difficulty labels per empire:

- Roman: Plebs / Legionarius / Senator / Imperator
- Chinese: Xiucai (秀才) / Juren (举人) / Jinshi (进士) / Zhuangyuan (状元)
- Ottoman: Reaya / Sipahi / Pasha / Vizier
- Japanese: Heimin (平民) / Samurai (武士) / Daimyo (大名) / Shogun (将軍)
- Labels defined in lib/config/quiz-difficulties.ts → EMPIRE_DIFFICULTY_LABELS

### quiz_questions.category values (Roman Empire):

- culture: 833
- politics: 833
- rulers: 833
- religion: 835
- geography: 833
- battles: 833
(Replaced old unbalanced set: culture 2889 / politics 383 / rulers 376 / religion 301 / geography 236 / battles 192)

### quiz_questions.category values (Chinese Empire):

- culture: 834
- politics: 834
- rulers: 834
- religion: 833
- geography: 833
- battles: 832

### quiz_questions.category values (Japanese Empire):

- culture: 833
- politics: 833
- rulers: 833
- religion: 835
- geography: 833
- battles: 833

### quiz_questions.correct column:

CHAR(1) — values 'A', 'B', 'C', 'D'. Maps to option index: A=0, B=1, C=2, D=3.

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
- tests/personality.test.ts: getPersonalityConfig tests — uses empire_id 99 for unsupported empire test
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

Files (Chinese Empire):

- chinese_bc1.geojson  — 1 BC, Han dynasty at peak
- chinese_500.geojson  — 500 AD, Period of Division (Toba Wei + Jin Empire)
- chinese_700.geojson  — 700 AD, early Tang era
- chinese_1100.geojson — 1100 AD, Northern Song
- chinese_1500.geojson — 1500 AD, Ming dynasty
- chinese_1800.geojson — 1800 AD, Qing dynasty at zenith

Files (Japanese Empire):

- japanese_800.geojson  — 800 AD, Nara/early Heian core state
- japanese_1200.geojson — 1200 AD, Imperial Japan (Fujiwara/Kamakura)
- japanese_1600.geojson — 1600 AD, Japan (Warring States unified by Tokugawa)
- japanese_1800.geojson — 1800 AD, stable Edo Japan
- japanese_1900.geojson — 1900 AD, Imperial Japan post-Sino-Japanese War (Taiwan acquired)
- japanese_1938.geojson — 1938 AD, Empire of Japan at continental peak (+ Saipan mandate)

## Current Phase

Phase 7 — Compare + Polish (Week 21-24)
Status: 🔄 IN PROGRESS — Compare page and cross-empire personality quiz complete.

## What is complete

### Phase 0 — Architecture (Week 1-2) ✓

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
- lib/config/personality/index.ts: multi-empire keying by empire_id
- Cosine similarity normalized to 0-100: `((similarity + 1) / 2) * 100` — never negative matchPercent
- PersonalityConfig.displayName: "Roman" (not "Roman Empire") for clean user-facing copy
- Static config (not DB) — no Supabase queries, no API routes

#### ✓ feature/seo-performance (merged to develop)

- lib/seo/metadata.ts: buildMetadata + buildEmpirePageMetadata helpers
- lib/seo/jsonld.ts: Organization, WebSite, BreadcrumbList, Quiz, Article JSON-LD builders
- app/sitemap.ts: dynamic sitemap with home + 4 empire overviews + sub-pages
- app/robots.ts: allow all, disallow /api/, link to sitemap
- generateMetadata on ALL routed pages
- AGENTS.md now exists at repo root and stays in sync with CLAUDE.md

### Phase 4 — Ottoman Empire (Week 12-14) ✓

#### ✓ Ottoman Data Import (complete)

- 37 sultans imported (Osman I through Abdulmejid II, empire_id=4)
- Name splitting: English name + Turkish native_name (Latin script, no RTL needed)
- death_cause mapped to DB enum: natural, assassination, illness, unknown
- bio_short smart-truncated to 300 chars at sentence boundaries
- Split reign periods resolved (Murad II, Mehmed II, Mustafa I): first start, last end
- 118 events with ruler_id mapping
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
- Registered in lib/config/personality/index.ts (empire_id=4)
- displayName: "Ottoman"

#### ✓ Ottoman Integration (code)

- Ottoman added to EMPIRE_CONFIGS: id=4, slug='ottoman', color=#1A6B3A, 1299-1922
- nativeName: "Devlet-i Aliyye-i Osmâniyye", capital: "ISTANBUL"
- 'ottoman' added to FULL_CONTENT_SLUGS in app/sitemap.ts
- GeoJSON files committed to /public/geojson/

#### ✓ Legacy Component Fix (multi-empire)

- LegacyRulersPage.tsx replaced with data-driven wrapper using getRulers(empire_id)
- LegacyTimelinePage.tsx replaced with data-driven wrapper using getEventsWithRulers(empire_id)
- Timeline category filters now derived from actual DB data (not hardcoded Roman categories)
- EventDetailCard.tsx recognizes 'religious' as first-class category
- AnalyticsDashboard category-neutral
- IntroScreen.tsx personality quiz uses empire-agnostic copy

#### ✓ Ottoman Territorial Enrichment

- lib/services/territorial.ts: Ottoman enrichment keyed by years 1400, 1500, 1600, 1700, 1800, 1900
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

### Phase 5 — Chinese Empire (Week 15-17) ✓

#### ✓ Chinese Data Import (complete)

- 101 emperors imported (Qin Shi Huang through Puyi, empire_id=2)
- Dynasty coverage: Qin, Western/Eastern Han, Xin, Three Kingdoms (Cao Wei/Shu Han/Eastern Wu),
  Western/Eastern Jin, Sui, Tang (incl. Wu Zetian/Zhou), Northern/Southern Song, Yuan, Ming, Qing
- Naming: "Emperor Wu of Han" style disambiguates repeated temple names across dynasties
- death_cause mapped to DB enum; 'unknown' confirmed valid in constraint
- 111 events — all 111 have ruler_id; categories: political 44, military 38, cultural 17, economic 8, religious 4
- Significance scale: 5=civilization-shaping, 4=major, 3=secondary
- 52 battles with corrected outcomes from primary Chinese regime perspective
  - 'inconclusive' removed (not in DB constraint) → mapped to defeat
- 56 places: city 23, temple 10, fort 8, palace 6, port 6, battle_site 3
- 24 provinces (formal Ming-Qing sheng system, IDs 94-117)
- Province backfill SQL applied (nearest-centroid CASE WHEN)
- 10 narrative chapters (4,037 words, -221 BC to 1912 AD)
  - Period boundaries: Age of Division 220-618; Yuan 1271-1368
  - Absolute claims softened per historiographic standards
- 6 GeoJSON territorial snapshots (-1, 500, 700, 1100, 1500, 1800)
- 6 empire_extent rows

#### ✓ Chinese Quiz Questions (5,000 imported)

- 5,000 questions generated via Python script with hand-crafted base questions
- 6 categories evenly distributed: culture 834, politics 834, rulers 834, religion 833, geography 833, battles 832
- Difficulty distribution: 1→1,297, 2→1,374, 3→1,289, 4→1,040
- Correct answer balanced: A=24.5%, B=24.9%, C=25.2%, D=25.4%
- All questions include explanation field; verified=FALSE
- Imported via Supabase Table Editor (6 CSV files, one per category)

#### ✓ Chinese Personality Quiz (static config)

- lib/config/personality/chinese.ts: 8 Chinese-themed questions + 6 emperor profiles
- 6 results: Qin Shi Huang, Kangxi Emperor, Wu Zetian, Yongzheng Emperor, Hongwu Emperor, Tang Xuanzong
- Registered in lib/config/personality/index.ts (empire_id=2)
- displayName: "Chinese"

#### ✓ Chinese Integration (code)

- Chinese already in EMPIRE_CONFIGS: id=2, slug='chinese', color=#DE2910, -221 to 1912
- nativeName: '中華帝國', capital: 'CHANGAN'
- 'chinese' added to FULL_CONTENT_SLUGS in app/sitemap.ts
- GeoJSON files committed to /public/geojson/ (chinese_bc1 through chinese_1800)
- Landing page (app/page.tsx): href='/chinese' added, "Coming soon" → "Explore"
- Landing page stats updated: 206 rulers, 7,738 places, 213 battles, 14,377 quiz questions, 327 events

#### ✓ Chinese Territorial Enrichment

- lib/services/territorial.ts: CHINESE_SNAPSHOTS constant with 6 curated snapshots
- CHINESE_SNAPSHOTS registered in SNAPSHOT_ENRICHMENTS (key 2)
- Chinese timeline markers added to TIMELINE_MARKERS (10 events)

#### ✓ Chinese Quiz Difficulty Labels

- lib/config/quiz-difficulties.ts: Chinese labels added under empire_id=2
- Xiucai (秀才) / Juren (举人) / Jinshi (进士) / Zhuangyuan (状元)

#### ✓ Chinese Bug Fixes

- lib/empires/config.ts: removed duplicate return line in getEmpireBySlug()
- chinese.ts personality: fixed question id type, removed invalid option id field

#### ✓ Chinese Overview Page Content

- /chinese renders curated long-form overview via CONTENT.chinese in components/empires/EmpireOverview.tsx
- Merged via feature/chinese-overview-content → develop (commit 50938c2)

### Phase 6 — Japanese Empire (Week 18-20) ✓ COMPLETE — Merged to main

#### ✓ Japanese Data Import (complete)

- 126 emperors imported (Jimmu through Naruhito, empire_id=3)
  - Dynasty field uses historical period names (Legendary → Kofun → Asuka → Nara → Heian → Kamakura → Nanboku-cho → Muromachi → Azuchi-Momoyama → Edo → Meiji → Taisho → Showa → Heisei → Reiwa)
  - death_cause: Anko/Sushun → assassination, Antoku → battle, Kobun → battle
  - Living emperors (Akihito, Naruhito): reign_end, death_year, death_cause all NULL
  - All bios ≤300 chars verified
- 140 events imported — all with ruler_id; coverage legendary period through 2021 Tokyo Olympics
  - 3 ruler assignment bugs fixed: Hogen Conflict → Go-Shirakawa; Shimabara → Empress Meisho; Great Fire of Meireki → Emperor Go-Sai
- 113 battles imported — 3 outcome fixes (Bunei → victory; Noryang → defeat; Coral Sea → defeat)
  - Generic 'Jokyu War' replaced with 3 specific 1221 engagements
  - 2 new battles: Imphal 1944 (65,000 casualties); Manila 1945 (100,000 civilian dead)
  - 'draw' confirmed valid in outcome CHECK constraint
- 124 places imported — duplicate coordinates resolved; Keijo removed; Ise shrine founded_year → -3
  - 17 new places: Nijo Castle, Goryokaku, Tsushima Island, Itsukushima Shrine, Fushimi Inari, Dazaifu Tenmangu, Nagoya, Hagi, Mito, Kochi, Inuyama Castle, Matsue Castle, and others
- 62 provinces imported — established year 701 (Taiho Code); Ezo established 1604
  - Province backfill: 118/124 places mapped; 6 NULL (Seoul; Pyongyang; Taihoku; Shuri; Port Arthur; Mukden)
- 17 chapters imported — 322–425 words each; dollar-quoted; boundary fixes applied
  - Muromachi period_start=1333, period_end=1467; Sengoku period_start=1467; coverage -14000 to 2019-NULL
- 6 empire_extent rows — years 800/1200/1600/1800/1900/1938; area arc 295K → 2100K km²
- 5,000 quiz questions — 6 CSV files (833 per category); difficulty 25/40/25/10%; correct A/B/C/D ~25% each
  - No commas in option text (semicolons or rephrasing used) — avoids Supabase CSV parser column-split issues
- 6 GeoJSON files committed to /public/geojson/ (japanese_800 through japanese_1938; all <200KB)
  - Cambodia/Cochin China excluded from 1938 (source data error; Japan didn't occupy until 1940-41)
  - No BC snapshots in source dataset; earliest viable polygon is 800 AD (Yamato state)

#### ✓ Roman Quiz Questions Regenerated

- Old 4,377 unbalanced questions deleted: `DELETE FROM quiz_questions WHERE empire_id = 1`
- 5,000 new balanced questions imported — 6 CSV files; same distribution as Japanese/Chinese/Ottoman
- All 6 categories now evenly balanced at ~833 each (was: culture 2889 / others 192-383)
- Roman total: 5,000 (up from 4,377)

#### ✓ Japanese Code Integration (all merged to main — PR #71)

- lib/services/territorial.ts: JAPANESE_SNAPSHOTS + TIMELINE_MARKERS[3] (PR #70)
  - Post-merge brace balance fix applied (2 missing braces + 1 missing `],`)
- lib/config/personality/japanese.ts: JAPANESE_PERSONALITY (spec-aligned ruler set)
  - 6 rulers: Emperor Meiji, Tokugawa Ieyasu, Emperor Kanmu, Emperor Go-Daigo, Emperor Showa, Prince Shotoku
  - All 32 delta arrays and 6 vector arrays verified at exactly 8 numbers each
  - displayName: "Japanese" (not "Japanese Empire")
- lib/config/personality/index.ts: 3: JAPANESE_PERSONALITY registered
- lib/config/quiz-difficulties.ts: Heimin (平民) / Samurai (武士) / Daimyo (大名) / Shogun (将軍) added
- lib/empires/config.ts: Japanese entry — nativeName '大日本帝国'; capital 'TOKYO'; color #BC002D
- app/sitemap.ts: 'japanese' added to FULL_CONTENT_SLUGS (now all 4 empires active)
- app/page.tsx: Japanese card enabled (href='/japanese'); stats updated to 332/7862/326/20000/467
- components/empires/EmpireOverview.tsx: CONTENT.japanese added (intro; 5 periods; 5 featured rulers)
  - Codex adapted content to actual file shape (not intro/periods/featuredRulers — real shape used)
- PR #71 merge conflict on app/page.tsx: resolved Accept Current Change (newer stats win)
- Uncommitted changes issue: Step 4 Codex changes sat uncommitted locally — always run `git status` after Codex

#### ✓ All Japanese Pages Verified Working (production)

- /japanese — Overview with curated content
- /japanese/rulers — 126 emperors from DB
- /japanese/map — Japanese places on Leaflet map
- /japanese/timeline — 140 events with data-driven category filters
- /japanese/territorial — 6 snapshots with enrichment (800-1938)
- /japanese/chapters — 17 chapters
- /japanese/quiz — Japanese questions from API (Heimin/Samurai/Daimyo/Shogun labels)
- /japanese/personality — 6 ruler results
- /japanese/analytics — Charts using empire.color #BC002D
- Lighthouse: passing (Vercel preview confirmed; production verified post merge-to-main)

### Phase 7 — Compare + Polish (Week 21-24) 🔄 IN PROGRESS

#### ✅ feature/compare-page (merged to develop — PR #73)

- /compare route: server component, revalidate 3600
- lib/types/compare.ts: EmpireExtentRow, CompareAggregates, CompareData, RulerAtYear
- lib/services/compare.ts: getCompareData(), getRulerAtYear()
- app/api/compare/ruler/route.ts: GET, Zod validated, no-store, server boundary
- lib/config/compare/scrubber.ts: SCRUBBER_MIN/MAX/DEFAULT, APEX_SNAPS, BUTTERFLY_BANDS
- lib/config/compare/legacyRadar.ts: LegacyProfile, LEGACY_RADAR_DATA (curated scores, not objective data)
- components/compare/CompareCanvas.tsx: orchestrator, currentYear state
- components/compare/TimelineScrubber.tsx: range input, SVG apex ticks, snap logic
- components/compare/VisualPulse.tsx: D3 overlapping area chart, butterfly band overlays, year marker
- components/compare/RulerVitals.tsx: client, fetches /api/compare/ruler, debounced 200ms
- components/compare/EmpireCard.tsx: active/fallen/not-founded badge, peak territory, RulerVitals
- components/compare/StatWidgets.tsx: 4 CSS-only bar charts (rulers, battles, events, peak territory)
- components/compare/LegacyRadar.tsx: D3 spider chart, 5 axes, 4 empire polygons
- /compare added to sitemap, Compare link added to EmpireSectionNav

#### ✅ feature/cross-empire-personality (merged to develop — PR #74)

- /compare/personality route: force-static, buildMetadata
- lib/types/crossPersonality.ts: PersonalityVector8 tuple type, CrossEmpireQuestion,
  CrossPersonalityResult, EmpireScore, EmpireId
- lib/config/personality/empireArchetypes.ts: EMPIRE_ARCHETYPES per empire (curated, not objective)
- lib/config/personality/crossQuestions.ts: CROSS_QUESTIONS (10 questions, 8 themes)
- lib/config/personality/crossAlgorithm.ts: calculateCrossEmpireResult()
  — builds single user vector from cross-questions
  — scores 4 empire archetypes via cosine similarity + empireBias
  — drills down to ruler via cosineSimilarity(userVector, ruler.vector) directly
  (does NOT reuse cross-question answer indices against empire-specific questions)
  — clamping fix applied: sort on unclamped rawScore, clamp only for matchPercent display
- components/compare/CrossPersonalityQuiz.tsx: intro/playing/result state machine, no timer
- components/compare/CrossEmpireResultCard.tsx: empire claim hero, ruler card, two-stage
  match explanation, tension bars, actions
- Promo strip added to CompareCanvas linking to /compare/personality
- /compare/personality added to sitemap

#### ✅ feature/cross-empire-personality-fix (merged to develop)

- crossAlgorithm.ts: rawScore unclamped for sorting; clamp applied only at matchPercent display
  Prevents tie-collapse when empireBias accumulates across 10 questions

#### ✅ feature/og-share-images (merged to develop — PR #76)

- app/api/og/personality/route.tsx: edge runtime, three-layer
  generation (Supabase cache → @vercel/og → static fallback)
- components/og/PersonalityOGCard.tsx: 1200×630 card, empire color,
  ruler initial avatar, match %, traits pills, gold aesthetic
- proxy.ts: /api/og/personality added to EXPENSIVE routes (15 req/60s)
- Metadata wiring: ogImage passed to buildMetadata helper on
  /[empire]/personality and /compare/personality pages
- Supabase Storage bucket 'og-cache' created (public, 2MB limit, image/png)

#### ✅ feature/admin-auth-foundation (merged to develop)

- `/admin` route gated by `user_roles.role = 'admin'` check in `proxy.ts`
- `/login` page with email + password form (Supabase Auth via `@supabase/ssr`)
- `lib/auth/admin.ts`: `getCurrentUser()`, `isAdmin()`, `requireAdmin()` helpers
- POST `/api/auth/signout` route (303 redirect to `/login`)
- Placeholder `/admin` page showing logged-in user email
- Non-admin users redirected to `/login?error=not_admin` with amber banner

#### ✅ feature/admin-shell-layout (merged to develop)

- `app/admin/layout.tsx`: wraps all admin pages, calls `requireAdmin()` (defense in depth)
- `app/admin/AdminShell.tsx`: collapsible left sidebar with toggle, empire selector, nav links
- `app/admin/EmpireSelector.tsx`: dropdown for 4 empires, persists via `?empire=<slug>` URL param
- `app/admin/SignOutButton.tsx`: native POST form to `/api/auth/signout` (server component, no JS needed)
- Sidebar nav links preserve `?empire=<slug>` param across navigation
- Dashboard page with cards linking to Chapters and Quiz Questions sections

#### ✅ feature/admin-chapters-crud (merged to develop)

- `lib/services/chapters.ts`: CRUD service + exported `Chapter`, `ChapterInsert`, `ChapterUpdate` types
- `app/api/admin/chapters/route.ts`: POST create (Zod validated, admin auth)
- `app/api/admin/chapters/[id]/route.ts`: PUT update + DELETE (admin auth)
- `app/admin/chapters/page.tsx`: empire-filtered table (sort_order, title, slug, period, actions)
- `app/admin/chapters/ChapterForm.tsx`: shared create/edit form with auto-slug, Markdown textarea
- `app/admin/chapters/DeleteChapterButton.tsx`: client delete with window.confirm
- `app/admin/chapters/new/page.tsx` + `app/admin/chapters/[id]/edit/page.tsx`: full-page create/edit

#### ✅ feature/admin-quiz-crud (merged to develop)

- `lib/services/quiz-admin.ts`: search/paginate/CRUD service + exported types (separate from public `quiz.ts`)
- `app/api/admin/quiz/route.ts`: GET search/filter/paginate + POST create (Zod validated, admin auth)
- `app/api/admin/quiz/[id]/route.ts`: PUT update + DELETE (admin auth, id validation → 400)
- `app/admin/quiz/QuizManager.tsx`: client orchestrator with filter dropdowns (category, difficulty, verified, free-text search), debounced search (300ms), paginated table (50/page)
- `app/admin/quiz/QuizEditModal.tsx`: edit/create modal with all fields, Escape-to-close, backdrop click guard, delete button
- Search escapes `%` and `_` for safe Postgres `ilike`; single `.select('*', { count: 'exact' })` query
- Client components use `import type` only from `quiz-admin.ts` (server boundary safety)
- Zod `.trim()` on all string fields prevents carriage return validation failures

#### ✅ Quiz data cleanup (applied to develop)

- Stripped `\r` carriage returns from `quiz_questions.category` (CSV import artifact)
- Deduplicated quiz questions: 20,000 → 1,123 unique (Roman 210, Chinese 315, Japanese 198, Ottoman 400)
- Duplicate cause: generation scripts produced ~12-25× copies per question
- Quiz question regeneration needed to restore 5,000 unique per empire

#### ✅ UX fixes (merged to develop)

- Removed redundant "Explore empires" / "Platform highlights" nav links from landing page header
- Quiz answer reveal delay increased from 1500ms → 5500ms (`advanceTimeoutRef` in `QuizGame.tsx`)
- `EmpireSectionNav` made sticky (`sticky top-0 z-10 bg-zinc-950 backdrop-blur-sm`)

#### ✅ feature/admin-auth-foundation (merged to develop — PR #__)

- /admin route gated by user_roles.role = 'admin' check in proxy.ts
- /login page with email + password (Supabase Auth)
- lib/auth/admin.ts: getCurrentUser, isAdmin, requireAdmin helpers
- POST /api/auth/signout route (303 redirect to /login)
- Admin role granted via SQL: INSERT INTO user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users WHERE email = '<email>'
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin'
- Auth foundation only — admin CRUD pages built in Steps 2-4

## Service Layer Pattern

All Supabase access goes through `lib/services/*.ts`. API routes and page.tsx server components import services, never call Supabase directly.

Current services:

- lib/services/rulers.ts
- lib/services/places.ts
- lib/services/quiz.ts (Phase 3: getQuizConfig + getQuizQuestions)
- lib/services/stats.ts
- lib/services/analytics.ts (Phase 3)
- lib/services/territorial.ts (Phase 3)
- lib/services/chapters.ts (Phase 7: admin CRUD — getChaptersByEmpire, getChapterById, createChapter, updateChapter, deleteChapter)
- lib/services/quiz-admin.ts (Phase 7: admin CRUD — searchQuizQuestions, getQuizQuestionById, createQuizQuestion, updateQuizQuestion, deleteQuizQuestion)

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

- Questions + ruler profiles live in lib/config/personality/[empire].ts
- Multi-empire keying via lib/config/personality/index.ts
- No Supabase queries, no API routes — pure client-side calculation
- PersonalityQuestion uses: id (number), question (string), dimension (string), options with delta (number[8])
- RulerProfile uses: id, name, title, years, portrait, color, description, traits (string[]), vector (number[8])
- PersonalityConfig uses: displayName, questions, rulers (NOT empireId, NOT rulerProfiles)

### Cosine Similarity

- 8 dimensions: power_style, conflict, legacy, innovation, people_focus, risk, moral_framework, charisma
- Normalized to 0-100: `((similarity + 1) / 2) * 100` — NEVER negative
- Zero-vector guard returns first ruler with 0% match

### DisplayName Pattern

- PersonalityConfig.displayName = "Roman" / "Ottoman" / "Chinese" / "Japanese" (not "X Empire")
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
- Current: ['roman', 'ottoman', 'chinese', 'japanese'] — all 4 empires active

## Charting — D3.js

All charts use D3.js + Observable Plot. Recharts is NOT used.
D3 + React pattern: 'use client', useRef<SVGSVGElement>, useEffect with cleanup, responsive viewBox, empire.color as prop.

## Navigation

Empire section nav (`EmpireSectionNav.tsx`) links:
Overview, Rulers, Map, Timeline, Territorial, Chapters, Quiz, Analytics, Personality
Admin navigation (`app/admin/AdminShell.tsx`):
Collapsible sidebar with: Empire selector dropdown, Chapters, Quiz Questions, Sign Out
Empire selector persists via `?empire=<slug>` URL param (default: roman)

## Data completeness — Roman Empire

| Table          | Rows  | Key fields populated                                    |
| -------------- | ----- | ------------------------------------------------------- |
| empires        | 4     | all 4 empires seeded                                    |
| rulers         | 68    | name, dynasty, reign_start/end, bio_short, image_url    |
| provinces      | 52    | name, centroid lat/lng                                  |
| places         | 7,608 | lat/lng, type, province_id, founded_year                |
| battles        | 101   | lat/lng, outcome, opposing_force, place_id, casualties  |
| events         | 98    | year, category, significance (1-5), ruler_id (62/98)    |
| chapters       | 7     | slug, title, content_md (Markdown), period_start/end    |
| empire_extent  | 6     | year, geojson_url, area_km2, notes                      |
| quiz_questions | 210 |  difficulty 1-4, 6 categories balanced (deduplicated from 5,000) |

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
| quiz_questions | 400 | difficulty 1-4, 6 categories balanced (deduplicated from 5,000)                            |
| GeoJSON files  | 6     | ottoman_1400 through ottoman_1900                       |
| personality    | 6     | sultan profiles, static config (not DB)                 |

## Data completeness — Chinese Empire

| Table          | Rows  | Key fields populated                                    |
| -------------- | ----- | ------------------------------------------------------- |
| rulers         | 101   | name, native_name, dynasty, reign_start/end, bio_short  |
| events         | 111   | year, category, significance, ruler_id (all 111)        |
| battles        | 52    | lat/lng, outcome, opposing_force, casualties            |
| places         | 56    | lat/lng, type, province_id, founded_year                |
| provinces      | 24    | name, native_name, established, dissolved (IDs 94-117)  |
| chapters       | 10    | slug, title, content_md (Markdown), period_start/end    |
| empire_extent  | 6     | year (-1, 500, 700, 1100, 1500, 1800), geojson_url      |
| quiz_questions | 315   | difficulty 1-4, 6 categories balanced (deduplicated from 5,000) |
| GeoJSON files  | 6     | chinese_bc1 through chinese_1800                        |
| personality    | 6     | emperor profiles, static config (not DB)                |

## Data completeness — Japanese Empire

| Table          | Rows  | Key fields populated                                                      |
| -------------- | ----- | ------------------------------------------------------------------------- |
| rulers         | 126   | name, native_name, dynasty, reign_start/end, bio_short                    |
| events         | 140   | year, category, significance, ruler_id (all)                              |
| battles        | 113   | lat/lng, outcome, opposing_force, casualties                              |
| places         | 124   | lat/lng, type, province_id, founded_year                                  |
| provinces      | 62    | name, native_name, established, dissolved                                 |
| chapters       | 17    | slug, title, content_md (300-500 words each, dollar-quoted)               |
| empire_extent  | 6     | years 800/1200/1600/1800/1900/1938, geojson_url, area_km2                 |
| quiz_questions | 198   | difficulty 1-4, 6 categories balanced (deduplicated from 5,000)             |
| GeoJSON files  | 6     | japanese_800 through japanese_1938 (all <200KB)                           |
| personality    | 6     | Meiji/Ieyasu/Kanmu/Go-Daigo/Showa/Shotoku, static config (not DB)         |

## Known technical debt

- iOS Safari test deferred (not yet verified)
- Playwright quiz + personality E2E tests needed
- Server-side PostHog capture deferred (share_clicked event)
- CI env vars use mock values — consider GitHub Secrets for real keys
- Province polygon boundaries deferred (nearest-centroid used for MVP)
- 2 pre-existing lint warnings in app/page.tsx and app/[empire]/timeline/page.tsx (custom font usage)
- Pre-existing D3 typing issues (Cannot find module 'd3' + implicit any) — not introduced by Phase 4/5/6
- .codex-worktrees/.next files cause repo-wide lint failures — gitignore recommended
- d3/@types/d3 missing from node_modules — causes repo-wide type-check failures
  on all D3 components (analytics, territorial, compare). Pre-existing debt,
  not introduced by Phase 7. Fix: npm install -D @types/d3
- .codex-worktrees/.next generated files cause repo-wide lint failures.
  Fix: add .codex-worktrees/ to .gitignore
- Quiz questions severely depleted after dedup: Roman 210, Chinese 315, Japanese 198, Ottoman 400 — need regeneration to 5,000 each
- Landing page stat "20000 quiz questions" is stale — actual count is 1,123 post-dedup; update after regeneration
- Admin API routes at /api/admin/* are not covered by proxy.ts admin guard — each route does its own auth check via getCurrentUser() + isAdmin()

## Key decisions & why

- Manual CSV import preferred over scripts: simpler for sources with Export buttons
- OG share image caching uses Supabase Storage bucket 'og-cache':
  @vercel/og rendering takes 300-800ms. Cache key pattern:
  `personality_{empireSlug}_{rulerName_sanitized}.png`
  First request generates + uploads PNG. Subsequent requests
  redirect to cached Supabase public URL (~20ms).
  Cache invalidation:
  Development: manually delete bucket contents in Supabase Dashboard
  Production: prefix cache key with version (e.g. v2_personality_...)
  so old files are ignored without downtime.
  Design change = bump version prefix or manually clear bucket.
- @vercel/og constraints (learned in Phase 7):
  - export const runtime = 'edge' required on the route
  - Every <div> with more than one child MUST have display: 'flex'
    or display: 'none' — no exceptions, stricter than standard React
  - Replace <p> and <span> with <div> — not supported
  - No @sentry/nextjs imports — Node.js only, breaks edge runtime
  - No Google Fonts fetch at build time — blocked at edge
  - Root container must have explicit width/height in px (not %)
  - All styles via inline style={{}} only — no Tailwind, no CSS vars
  - Flexbox only — no CSS Grid
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
- Personality quiz uses static config (not DB): curated content, no service layer needed
- Cosine similarity normalized to 0-100: prevents negative matchPercent in UI
- PersonalityConfig.displayName: avoids "Roman Empire Ruler" awkward copy
- SEO metadata centralized in lib/seo/: consistent titles, descriptions, OG across all pages
- SEO title ownership: helpers return final title, layout does not double-append
- JSON-LD as server components: no client JS overhead for structured data
- Sitemap only includes shipped content: FULL_CONTENT_SLUGS prevents empty page indexing
- Ottoman native names use Latin script (not Arabic) — no RTL handling needed
- Ottoman GeoJSON extracted from aourednik/historical-basemaps world files — single Ottoman polygon per year
- Death cause mapped: detailed causes → DB enum (illness, natural, assassination, battle, unknown)
- Split reign sultans: first reign_start, last reign_end stored (Murad II: 1421-1451)
- Chapters via SQL INSERT with dollar-quoting ($$) — avoids apostrophe escaping issues in Markdown content
- Events category CHECK constraint: political/military/cultural/religious/economic/natural
- Province backfill via nearest-centroid SQL (same pattern across all empires)
- Legacy components (LegacyRulersPage, LegacyTimelinePage) replaced with data-driven wrappers — multi-empire compatible
- Battles 'inconclusive' outcome not in DB constraint — mapped to 'defeat' for closest semantic match
- Chinese rulers: 101 curated (not exhaustive ~550) — 80/20 rule; all major dynasties covered
- Chinese naming: "Emperor Wu of Han" style disambiguates repeated temple names across dynasties
- Chinese dynasty field uses granular values: "Western Han", "Eastern Han", "Northern Song" etc.
- Chinese battle outcomes: always from perspective of the primary Chinese regime at that time
- Chinese provinces: formal Ming-Qing sheng system only
- Chinese GeoJSON year -1: DB convention uses exact snapshot years; bc1 source maps to year -1
- Chinese 500 AD snapshot uses two polygons (Toba Wei + Jin Empire) for the divided empire
- Chinese quiz difficulty labels: Xiucai/Juren/Jinshi/Zhuangyuan (imperial examination ranks)
- Chinese personality quiz structure: delta arrays + vector arrays matching Ottoman/Roman pattern exactly
- Landing page stats: 332 rulers / 7862 places / 326 battles / 1123 quiz (post-dedup, pending regeneration) / 467 events
- Vitest personality test: uses empire_id 99 (not 4) for unsupported empire case — Ottoman now registered
- Japanese rulers: 126 complete (all emperors Jimmu through Naruhito — NOT 80/20; unbroken imperial line warrants completeness)
- Japanese dynasty field uses historical period names (Legendary, Kofun, Asuka, etc.) — single dynasty throughout history
- Japanese chapters: 17 (more than other empires) to cover full arc from -14000 to present; 300-500 words each
- Japanese chapter boundaries: Muromachi ends 1467 (Onin War start), Sengoku starts 1467 — no overlap
- Japanese GeoJSON: no BC snapshots in source data; earliest polygon is 800 AD (Yamato state)
- Japanese 1938 snapshot: Cambodia/Cochin China excluded despite SUBJECTO='Empire of Japan' in source (Japan didn't occupy Indochina until 1940-41 — source data error)
- Japanese provinces established year: 701 (Taiho Code) not 700 — more historically precise
- Japanese province backfill: 118/124 places mapped; 6 outside Japan (Korea, China, Ryukyu, Taiwan) remain NULL
- Japanese 'draw' outcome: confirmed valid in battles CHECK constraint
- Battles dataset evaluated and corrected before import — 3 outcome fixes applied
- territorial.ts merge conflicts: always "Accept Both Changes" — both sides add empire entries to same objects; never choose one side only
- territorial.ts brace balance: verify `{` count == `}` count after every merge conflict resolution — conflict markers can silently drop closing braces causing Turbopack parse errors
- Personality quiz ruler set: Japanese spec set is Meiji, Ieyasu, Kanmu, Go-Daigo, Showa, Prince Shotoku — do not substitute without explicit override note
- Codex prompt discipline: always add "Do not modify any other files" and "Do not change existing exports, interfaces, or function bodies" explicitly — implied scope is insufficient
- Codex prompt verification: "For this step, run type-check and lint only" — avoid claiming these are "sufficient" in absolute terms; CI still runs the full suite on PRs
- Codex prompt dimension keys: always list all 8 fixed personality dimension keys explicitly and say "use only these" — prevents near-match typo drift across personality configs
- Codex prompt style: say "match the file's existing import/export/style pattern" not "use this exact content" — repo enforces ESLint + Prettier, stylistic consistency matters beyond just type annotations
- Quiz question CSV generation: use 6 separate CSV files (one per category) not one combined file — avoids Supabase Table Editor CSV parser issues with commas inside quoted option text
- Quiz option text: no commas inside option text — use semicolons or rephrase; Supabase CSV parser splits on commas even inside quoted fields
- Roman quiz questions replaced: old 4,377 unbalanced set (culture 66%) deleted and replaced with 5,000 balanced questions matching Ottoman/Chinese/Japanese standard
- Uncommitted Codex changes: always verify with `git status` after Codex runs — changes sitting locally but not pushed will not appear on Vercel preview or develop branch
- app/page.tsx merge conflict resolution: always Accept Current Change when stats numbers conflict — the newer branch has the correct updated stats
- EmpireOverview.tsx CONTENT shape: Codex must read the actual file shape before writing content — the real type may differ from the prompt's suggested schema (happened during Phase 6 Japanese overview)
- Compare page uses /api/compare/ruler API route for RulerVitals: server-side
  Supabase access must not be imported into client components — API route is
  the correct server boundary
- Cross-empire personality uses single user vector (not per-empire vectors):
  simpler to author, test, and reason about; empire discrimination via
  archetype cosine similarity + small empireBias nudges
- Ruler drill-down uses cosineSimilarity(userVector, ruler.vector) directly:
  cross-question answer indices are semantically incompatible with
  empire-specific personality question indices
- CrossPersonalityResult type named distinctly from CrossEmpireResultCard
  component: avoids TypeScript import/name collision
- PersonalityVector8 tuple type: enforces exactly 8 numbers at compile time
- Empire archetype scores and Legacy Radar scores are curated product
  scores — not objective historical data. Both are labeled in code comments
  and UI captions.
- Sort empire scores on unclamped rawScore: clamping before sort collapses
  distinct scores to ceiling value across 10 questions, biasing results
  toward lower empire_id order
- Admin auth uses Supabase Auth + user_roles table (not env var password or Vercel protection) — per-user revocation, audit trail, reuses Phase 0 infrastructure
- Admin layout: collapsible sidebar, empire selector via URL param (?empire=slug) — shareable, debuggable, no hidden state
- Admin quiz CRUD uses separate lib/services/quiz-admin.ts (not extending quiz.ts) — different query patterns (pagination, search), avoids breaking public quiz
- Admin API routes use getCurrentUser() + isAdmin() (not requireAdmin()) — API routes need HTTP status codes (401/403), not redirects
- Client components importing from service files must use `import type` only — prevents server Supabase client from leaking into client bundle
- Quiz questions deduplicated via SQL (keep MIN(id) per empire_id + question) — generation scripts produced 12-25× copies per unique question
- Zod .trim() added to all admin API string fields — prevents \r carriage return validation failures from CSV import artifacts
- Quiz answer reveal delay: 5500ms (was 1500ms) — users need time to read the correct answer and explanation
- EmpireSectionNav sticky: prevents losing navigation context when scrolling long pages (rulers, timeline)

## Lighthouse scores (production — ancient-empires.vercel.app)

- Phase 3 final: Performance 96, Accessibility 100, Best Practices 96, SEO 100
- Fixed from Phase 2: NO_LCP error resolved (server-rendered hero, priority image, font display swap)
- SEO 100 achieved after adding app/robots.ts + app/sitemap.ts (were missing from repo)
- Note: Vercel preview URLs always show SEO 66-69 due to x-robots-tag: noindex header — always test on production URL
- Ottoman production Lighthouse (ancient-empires.vercel.app/ottoman): Performance 96, matches Roman
- Phase 6 production Lighthouse: passing — all 4 empires verified on ancient-empires.vercel.app

## On the Horizon — Phase 7 remaining

- **Quiz question regeneration**: all 4 empires need 5,000 unique questions each (currently 210/315/198/400 after dedup)
- i18n translations (Italian, German, Turkish, Japanese) via Claude Code
- Deferred Phase 2 debt: iOS Safari test, GitHub Secrets for CI env vars,
  server-side PostHog capture for quiz_completed and share_clicked
- `npm install -D @types/d3` (repo-wide type-check failures on D3 components)
- Add `.codex-worktrees/` to `.gitignore` (causing repo-wide lint failures)
- `SUPABASE_SERVICE_ROLE_KEY` rotation and mark as Sensitive in Vercel

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
- Personality quiz type structure (question/dimension/delta, not text/dimensions object)
- SEO title ownership model (helpers return final title)
- lib/seo/metadata.ts as single source for metadata helpers
