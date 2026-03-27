// lib/env.ts - lazy Zod env validation
// Values are validated on first access so builds do not fail while merely importing modules.

import { z } from 'zod';

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  SENTRY_DSN: z.string().url(),
  CRON_SECRET: z.string().min(16),
});

type PublicEnv = z.infer<typeof publicSchema>;
type ServerEnv = z.infer<typeof serverSchema>;
type Env = PublicEnv & ServerEnv;

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

function parseEnv<T>(schema: z.ZodSchema<T>): T {
  const parsed = schema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      'Invalid environment variables:\n',
      parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables - check logs above');
  }

  return parsed.data;
}

function getPublicEnv(): PublicEnv {
  if (!cachedPublicEnv) {
    cachedPublicEnv = parseEnv(publicSchema);
  }

  return cachedPublicEnv;
}

function getServerEnv(): ServerEnv {
  if (!cachedServerEnv) {
    cachedServerEnv = parseEnv(serverSchema);
  }

  return cachedServerEnv;
}

export const env = {} as Env;

Object.defineProperties(env, {
  NEXT_PUBLIC_SUPABASE_URL: {
    enumerable: true,
    get: () => getPublicEnv().NEXT_PUBLIC_SUPABASE_URL,
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    enumerable: true,
    get: () => getPublicEnv().NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  NEXT_PUBLIC_SENTRY_DSN: {
    enumerable: true,
    get: () => getPublicEnv().NEXT_PUBLIC_SENTRY_DSN,
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    enumerable: true,
    get: () => getServerEnv().SUPABASE_SERVICE_ROLE_KEY,
  },
  UPSTASH_REDIS_REST_URL: {
    enumerable: true,
    get: () => getServerEnv().UPSTASH_REDIS_REST_URL,
  },
  UPSTASH_REDIS_REST_TOKEN: {
    enumerable: true,
    get: () => getServerEnv().UPSTASH_REDIS_REST_TOKEN,
  },
  SENTRY_DSN: {
    enumerable: true,
    get: () => getServerEnv().SENTRY_DSN,
  },
  CRON_SECRET: {
    enumerable: true,
    get: () => getServerEnv().CRON_SECRET,
  },
});
