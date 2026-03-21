// lib/env.ts — Zod env validation
// Parsed once at startup; throws with a clear message if any var is missing/invalid.
// Import `env` instead of accessing process.env directly.

import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  SENTRY_DSN: z.string().url(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  CRON_SECRET: z.string().min(16),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables — check logs above');
}

export const env = parsed.data;
