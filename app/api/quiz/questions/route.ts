import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError, toApiError } from '@/lib/errors';
import { getQuizQuestions } from '@/lib/services/quiz';

const requestSchema = z.object({
  empireId: z.number().int().min(1).max(4),
  difficulty: z.number().int().min(1).max(4),
  category: z.string().min(1),
  count: z.number().int().min(5).max(20),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      throw AppError.badRequest('Invalid quiz request');
    }

    const questions = await getQuizQuestions(
      parsed.data.empireId,
      parsed.data.difficulty,
      parsed.data.category,
      parsed.data.count
    );

    return NextResponse.json(questions, {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      const apiError = toApiError(error);

      return NextResponse.json(
        { error: apiError.error },
        {
          status: apiError.status,
          headers: {
            'Cache-Control': 'private, no-store',
          },
        }
      );
    }

    console.error('Quiz questions API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  }
}
