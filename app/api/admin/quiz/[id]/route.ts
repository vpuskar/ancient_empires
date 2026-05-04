import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, isAdmin } from '@/lib/auth/admin';
import {
  deleteQuizQuestion,
  updateQuizQuestion,
} from '@/lib/services/quiz-admin';

const categories = [
  'culture',
  'politics',
  'rulers',
  'religion',
  'geography',
  'battles',
] as const;

const updateSchema = z
  .object({
    question: z.string().min(1).optional(),
    option_a: z.string().min(1).optional(),
    option_b: z.string().min(1).optional(),
    option_c: z.string().min(1).optional(),
    option_d: z.string().min(1).optional(),
    correct: z.enum(['A', 'B', 'C', 'D']).optional(),
    difficulty: z.number().int().min(1).max(4).nullable().optional(),
    category: z.enum(categories).nullable().optional(),
    explanation: z.string().nullable().optional(),
    verified: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0);

interface QuizQuestionRouteContext {
  params: Promise<{ id: string }>;
}

async function requireApiAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const admin = await isAdmin(user.id);

  if (!admin) {
    return {
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  return { user };
}

async function parseQuestionId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const questionId = Number(id);

  if (!Number.isInteger(questionId) || questionId < 1) {
    return null;
  }

  return questionId;
}

export async function PUT(
  request: Request,
  { params }: QuizQuestionRouteContext
) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const questionId = await parseQuestionId(params);

    if (!questionId) {
      return NextResponse.json(
        { error: 'Invalid question id' },
        { status: 400 }
      );
    }

    const json = await request.json();
    const parsed = updateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    const question = await updateQuizQuestion(questionId, parsed.data);

    return NextResponse.json(question);
  } catch (error) {
    console.error('Update quiz question API error:', error);

    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: QuizQuestionRouteContext
) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const questionId = await parseQuestionId(params);

    if (!questionId) {
      return NextResponse.json(
        { error: 'Invalid question id' },
        { status: 400 }
      );
    }

    await deleteQuizQuestion(questionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quiz question API error:', error);

    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
