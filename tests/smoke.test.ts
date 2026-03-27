import { beforeEach, describe, expect, it, vi } from 'vitest';

// Reset modules before each test so lib/env.ts re-evaluates process.env
beforeEach(() => {
  vi.resetModules();
});

const VALID_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
  UPSTASH_REDIS_REST_URL: 'https://redis.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'upstash-token',
  SENTRY_DSN: 'https://abc@sentry.io/123',
  CRON_SECRET: 'a-secret-at-least-16-chars',
};

describe('lib/env - Zod validation', () => {
  it('passes with all valid env vars', async () => {
    process.env = { ...process.env, ...VALID_ENV };
    const { env } = await import('@/lib/env');

    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(
      VALID_ENV.NEXT_PUBLIC_SUPABASE_URL
    );
    expect(env.CRON_SECRET).toBe(VALID_ENV.CRON_SECRET);
  });

  it('throws when a required var is missing', async () => {
    process.env = { ...process.env, ...VALID_ENV };
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const { env } = await import('@/lib/env');

    expect(() => env.SUPABASE_SERVICE_ROLE_KEY).toThrow(
      'Invalid environment variables'
    );
  });

  it('throws when a URL var is not a valid URL', async () => {
    process.env = {
      ...process.env,
      ...VALID_ENV,
      NEXT_PUBLIC_SUPABASE_URL: 'not-a-url',
    };

    const { env } = await import('@/lib/env');

    expect(() => env.NEXT_PUBLIC_SUPABASE_URL).toThrow(
      'Invalid environment variables'
    );
  });

  it('throws when CRON_SECRET is shorter than 16 chars', async () => {
    process.env = { ...process.env, ...VALID_ENV, CRON_SECRET: 'tooshort' };

    const { env } = await import('@/lib/env');

    expect(() => env.CRON_SECRET).toThrow('Invalid environment variables');
  });
});
