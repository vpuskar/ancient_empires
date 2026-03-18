# Ancient Empires — Project Context for Claude Code

## Stack
Next.js 15 (App Router), TypeScript strict, Supabase, Tailwind CSS v4,
Leaflet + React-Leaflet, D3.js + Observable Plot, Framer Motion, Zustand, next-intl

## Architecture — CRITICAL
Multi-tenant single codebase. Empire = data record (empire_id), NOT a separate app.
Never build empire-specific components — every component accepts an `empire` config prop.

empire_id mapping:
- 1 = Roman Empire    (slug: 'roman',    #8B0000, 509 BC – 476 AD)
- 2 = Chinese Empire  (slug: 'chinese',  #DE2910, 221 BC – 1912 AD)
- 3 = Japanese Empire (slug: 'japanese', #BC002D, 660 BC – 1945 AD)
- 4 = Ottoman Empire  (slug: 'ottoman',  #1A6B3A, 1299 – 1922 AD)

## Routing
All pages under /[empire]/ dynamic segment.
Compare page: /compare/personality (cross-empire quiz)

## Branching — CRITICAL
main → develop → feature/*
NEVER merge directly into main.
feature/* → develop (test on Vercel preview) → main → auto Vercel deploy

## AI Tools (v1.3)
- Claude Code (terminal): import scripts, SEO, i18n, format transformation
- Lovable: UI components
- Claude Haiku API: batch content (quiz questions, ruler bios)
- Dependabot: dependency updates (Jules is NOT in use)

## Database Schema (Supabase)
Tables: empires, rulers, provinces, places, events, battles,
        empire_extent, quiz_questions, chapters, analytics_cache
Materialised view: search_index

Key convention: negative integers for BC dates (-117 = 117 BC)

## Security — CRITICAL
- SUPABASE_SERVICE_ROLE_KEY → server-side only, never NEXT_PUBLIC_
- NEXT_PUBLIC_SUPABASE_ANON_KEY → client-safe (RLS enforces access)
- Rate limiting: active from Phase 0 (proxy.ts — Next.js 16 convention)
- RLS enabled on ALL tables before any data import
- All AI/Claude API keys: server-side Route Handlers only

## GeoJSON
GeoJSON files NEVER go into the database.
Location: /public/geojson/
Max size: 200KB per file (simplify at mapshaper.org before saving)

## Current Phase
[UPDATE THIS at the end of each phase — takes 10 minutes, eliminates bus factor]
Phase 1 — Data Foundation: Roman Empire (Week 3-4)
Status: NOT STARTED

## What is complete
- Phase 0 complete (Week 1-2)
- Supabase project created with full schema (10 tables + RLS)
- All 4 empires seeded in empires table
- Next.js 15 project initialized (TypeScript strict, Tailwind v4)
- Dependencies installed: @supabase/supabase-js, @supabase/ssr, zustand, framer-motion
- lib/supabase/client.ts and server.ts created
- lib/empires/config.ts with EMPIRE_CONFIGS and getEmpireBySlug()
- app/[empire]/page.tsx dynamic routing (returns 404 for unknown slugs)
- app/page.tsx landing page with 4 empire cards
- proxy.ts rate limiting (100 req/min per IP on /api/*)
- Vercel production deployment live at ancient-empires.vercel.app
- GitHub: main, develop, feature/phase-0-architecture branches
- Branch protection on main

## What is in progress
- (nothing — Phase 1 not yet started)

## Do NOT change without consultation
- Supabase table schema (migrations are final once data is imported)
- empire_id values (1=Roman, 2=Chinese, 3=Japanese, 4=Ottoman)
- EMPIRE_CONFIGS in lib/empires/config.ts (once created)
- RLS policies on all tables
- GeoJSON max size limit of 200KB

## Key decisions & why
- Manual CSV import preferred over scripts: simpler, no Node.js needed for sources with Export buttons
- OG image cache (Supabase Storage) mandatory: prevents 2s render on every Twitter/WhatsApp share
- Rate limiting from Phase 0: single Reddit post can exhaust Supabase free tier without it
- data/personality-content Git branch removed: local one-time script instead (scripts/generate-personality-content.ts)
- Next.js 15 installed (not 14) — same App Router architecture, no functional difference
- Tailwind v4 installed — no tailwind.config.ts needed, config in CSS
- Rate limiting file named proxy.ts (not middleware.ts) — Next.js 16 convention
