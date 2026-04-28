export const runtime = 'edge';

import { ImageResponse } from 'next/og';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { PersonalityOGCard } from '@/components/og/PersonalityOGCard';

const EMPIRES = {
  roman: { color: '#8B0000', label: 'Roman Empire' },
  chinese: { color: '#DE2910', label: 'Chinese Empire' },
  japanese: { color: '#BC002D', label: 'Japanese Empire' },
  ottoman: { color: '#1A6B3A', label: 'Ottoman Empire' },
} as const;

const querySchema = z.object({
  empireSlug: z.enum(['roman', 'chinese', 'japanese', 'ottoman']),
  rulerName: z.string().min(1),
  rulerTitle: z.string().min(1),
  matchPercent: z.coerce.number().min(0).max(100),
  traits: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((trait) => trait.trim())
        .filter(Boolean)
    )
    .refine((value) => value.length <= 3, {
      message: 'Traits must contain at most 3 values',
    }),
});

function getQueryParams(request: Request) {
  const searchParams = new URL(request.url).searchParams;

  return {
    empireSlug: searchParams.get('empireSlug'),
    rulerName: searchParams.get('rulerName'),
    rulerTitle: searchParams.get('rulerTitle'),
    matchPercent: searchParams.get('matchPercent'),
    traits: searchParams.get('traits'),
  };
}

function getCacheKey(empireSlug: string, rulerName: string) {
  return `personality_${empireSlug}_${rulerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')}.png`;
}

async function getInterFont() {
  try {
    const response = await fetch(
      'https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTcviYwYZ8UA3.woff2'
    );

    if (!response.ok) {
      throw new Error(`Inter font fetch failed with status ${response.status}`);
    }

    return await response.arrayBuffer();
  } catch (error) {
    Sentry.captureException(error);
    return undefined;
  }
}

export async function GET(request: Request) {
  const parsed = querySchema.safeParse(getQueryParams(request));

  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid OG image parameters' },
      { status: 400 }
    );
  }

  const { empireSlug, rulerName, rulerTitle, matchPercent, traits } =
    parsed.data;
  const empire = EMPIRES[empireSlug];
  const cacheKey = getCacheKey(empireSlug, rulerName);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = 'og-cache';
  const objectPath = `${supabaseUrl}/storage/v1/object/${bucket}/${cacheKey}`;
  const publicPath = `${supabaseUrl}/storage/v1/object/public/${bucket}/${cacheKey}`;

  try {
    const cached = await fetch(objectPath, {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    if (cached.ok) {
      return Response.redirect(publicPath, 302);
    }
  } catch {
    // Cache lookup is best-effort; generation below is the fallback path.
  }

  try {
    const fontData = await getInterFont();
    const imageResponse = new ImageResponse(
      <PersonalityOGCard
        empireColor={empire.color}
        empireLabel={empire.label}
        rulerName={rulerName}
        rulerTitle={rulerTitle}
        matchPercent={matchPercent}
        traits={traits}
      />,
      {
        width: 1200,
        height: 630,
        ...(fontData
          ? {
              fonts: [
                {
                  name: 'Inter',
                  data: fontData,
                  weight: 400,
                },
              ],
            }
          : {}),
      }
    );
    const buffer = await imageResponse.arrayBuffer();

    try {
      const upload = await fetch(objectPath, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'image/png',
          'x-upsert': 'true',
        },
        body: buffer,
      });

      if (!upload.ok) {
        throw new Error(`OG cache upload failed with status ${upload.status}`);
      }
    } catch (error) {
      Sentry.captureException(error);
    }

    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    return Response.redirect('/og-fallback.png', 302);
  }
}
