// proxy.ts — STAVI U ROOT FOLDER PROJEKTA (ne u /app/ ili /src/)
// Phase 0 — Rate limiting: 100 req/min per IP na svim /api/* rutama
// Spec: Section 7 — CRITICAL, mora biti aktivan od Phase 0

import { NextRequest, NextResponse } from 'next/server';

// In-memory store: radi za Vercel Edge (resetira se po deploymentu)
// Za produkciju s više od 100k posjetitelja: zamijeni s Upstash Redis
const rateLimit = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000;   // 1 minuta
const MAX_REQUESTS = 100;       // 100 zahtjeva po IP-u

export function proxy(request: NextRequest) {
  // Samo /api/* rute — statične stranice i RSC su slobodne
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Uzmi IP — Vercel uvijek šalje x-forwarded-for
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? request.headers.get('x-real-ip')
    ?? 'anonymous';

  const now = Date.now();
  const current = rateLimit.get(ip);

  // Novi IP ili istekao prozor — resetiraj brojač
  if (!current || current.resetTime < now) {
    rateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return NextResponse.next();
  }

  // Prekoračen limit
  if (current.count >= MAX_REQUESTS) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((current.resetTime - now) / 1000)),
          'X-RateLimit-Limit': String(MAX_REQUESTS),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(current.resetTime),
        },
      }
    );
  }

  // Inkrementiraj brojač
  current.count++;

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(MAX_REQUESTS));
  response.headers.set('X-RateLimit-Remaining', String(MAX_REQUESTS - current.count));
  response.headers.set('X-RateLimit-Reset', String(current.resetTime));
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
