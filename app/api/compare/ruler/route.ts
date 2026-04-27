import { NextResponse } from 'next/server';
import { z } from 'zod';

import { AppError, toApiError } from '@/lib/errors';
import { getRulerAtYear } from '@/lib/services/compare';

const requestSchema = z.object({
  empireId: z.coerce.number().int().min(1).max(4),
  year: z.coerce.number().int(),
});

const noStoreHeaders = {
  'Cache-Control': 'no-store',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = requestSchema.safeParse({
      empireId: searchParams.get('empireId'),
      year: searchParams.get('year'),
    });

    if (!parsed.success) {
      throw AppError.badRequest('Invalid compare ruler request');
    }

    const ruler = await getRulerAtYear(parsed.data.empireId, parsed.data.year);

    return NextResponse.json(ruler, {
      headers: noStoreHeaders,
    });
  } catch (error) {
    if (error instanceof AppError) {
      const apiError = toApiError(error);

      return NextResponse.json(
        { error: apiError.error },
        {
          status: apiError.status,
          headers: noStoreHeaders,
        }
      );
    }

    console.error('Compare ruler API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: noStoreHeaders,
      }
    );
  }
}
