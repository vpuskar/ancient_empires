import { NextRequest, NextResponse } from 'next/server';
import { getPostHog } from '@/lib/posthog/server';

export async function POST(request: NextRequest) {
  try {
    const ph = getPostHog();
    if (!ph) {
      return NextResponse.json({ success: false }, { status: 200 });
    }

    const { event, properties, distinctId } = await request.json();

    ph.capture({
      distinctId: distinctId || 'anonymous',
      event,
      properties,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PostHog tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
