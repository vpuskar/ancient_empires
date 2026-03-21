// middleware.ts — Next.js Edge Middleware
// Upstash Redis tiered rate limiting (v1.4)
//
// Standard:  /api/*                    100 req / 60s per IP
// Expensive: /api/personality/og       15  req / 60s per IP
//            /api/quiz/calculate       15  req / 60s per IP

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? (() => { throw new Error('Missing UPSTASH_REDIS_REST_URL') })(),
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? (() => { throw new Error('Missing UPSTASH_REDIS_REST_TOKEN') })(),
});

const tiers = {
  expensive: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(15, '60 s'),
    prefix: 'rl:exp',
    ephemeralCache: new Map(),
  }),
  standard: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '60 s'),
    prefix: 'rl:std',
    ephemeralCache: new Map(),
  }),
};

const EXPENSIVE_ROUTES = ['/api/personality/og', '/api/quiz/calculate'];

function getTier(pathname: string): keyof typeof tiers {
  if (EXPENSIVE_ROUTES.some(r => pathname.startsWith(r))) return 'expensive';
  return 'standard';
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'anonymous';

  const tier = getTier(pathname);
  const { success, limit, remaining, reset } = await tiers[tier].limit(ip);

  const retryAfter = Math.ceil((reset - Date.now()) / 1000);

  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(reset),
          'X-RateLimit-Tier': tier,
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(limit));
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset', String(reset));
  response.headers.set('X-RateLimit-Tier', tier);
  return response;
}

export const config = {
  matcher: '/api/:path*',
};