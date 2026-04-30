// proxy.ts - Next.js Edge Proxy
// Upstash Redis tiered rate limiting (v1.4)
//
// Standard:  /api/*                    100 req / 60s per IP
// Expensive: /api/personality/og       15  req / 60s per IP
//            /api/quiz/calculate       15  req / 60s per IP

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/lib/env';

let tiers:
  | {
      expensive: Ratelimit;
      standard: Ratelimit;
    }
  | undefined;

function getTiers() {
  if (!tiers) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    tiers = {
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
  }

  return tiers;
}

const EXPENSIVE_ROUTES = [
  '/api/personality/og',
  '/api/og/personality',
  '/api/quiz/calculate',
];

function getTier(pathname: string): 'expensive' | 'standard' {
  if (EXPENSIVE_ROUTES.some((route) => pathname.startsWith(route))) {
    return 'expensive';
  }

  return 'standard';
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let adminResponse: NextResponse | null = null;

  if (pathname.startsWith('/admin')) {
    adminResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            adminResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              adminResponse?.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .limit(1);

    if (error || (data?.length ?? 0) === 0) {
      return NextResponse.redirect(
        new URL('/login?error=not_admin', request.url)
      );
    }
  }

  if (!pathname.startsWith('/api/')) {
    return adminResponse ?? NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'anonymous';

  const tier = getTier(pathname);
  const { success, limit, remaining, reset } = await getTiers()[tier].limit(ip);

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
  matcher: ['/api/:path*', '/admin/:path*'],
};
