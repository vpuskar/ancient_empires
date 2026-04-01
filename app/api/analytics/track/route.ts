import { NextRequest, NextResponse } from 'next/server';
import { getPostHog } from '@/lib/posthog/server';

const DYNAMIC_CACHE_CONTROL = 'private, no-store';

export async function POST(request: NextRequest) {
  try {
    const ph = getPostHog();
    if (!ph) {
      return NextResponse.json(
        { success: false },
        {
          status: 200,
          headers: {
            'Cache-Control': DYNAMIC_CACHE_CONTROL,
          },
        }
      );
    }

    const { event, properties, distinctId } = await request.json();

    ph.capture({
      distinctId: distinctId || 'anonymous',
      event,
      properties,
    });

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': DYNAMIC_CACHE_CONTROL,
        },
      }
    );
  } catch (error) {
    console.error('PostHog tracking error:', error);
    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: {
          'Cache-Control': DYNAMIC_CACHE_CONTROL,
        },
      }
    );
  }
}
