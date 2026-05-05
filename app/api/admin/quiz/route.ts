import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, isAdmin } from '@/lib/auth/admin';
import {
  createQuizQuestion,
  searchQuizQuestions,
} from '@/lib/services/quiz-admin';

const categories = [
  'culture',
  'politics',
  'rulers',
  'religion',
  'geography',
  'battles',
] as const;

const correctOptions = ['A', 'B', 'C', 'D'] as const;

const getSchema = z.object({
  empire_id: z.coerce.number().int().min(1).max(4),
  category: z.enum(categories).optional(),
  difficulty: z.coerce.number().int().min(1).max(4).optional(),
  verified: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const createSchema = z.object({
  empire_id: z.number().int().min(1).max(4),
  question: z.string().trim().min(1),
  option_a: z.string().trim().min(1),
  option_b: z.string().trim().min(1),
  option_c: z.string().trim().min(1),
  option_d: z.string().trim().min(1),
  correct: z.string().trim().pipe(z.enum(correctOptions)),
  difficulty: z.number().int().min(1).max(4).nullable().optional(),
  category: z.string().trim().pipe(z.enum(categories)).nullable().optional(),
  explanation: z.string().trim().nullable().optional(),
  verified: z.boolean().optional(),
});

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

export async function GET(request: Request) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const { searchParams } = new URL(request.url);
    const parsed = getSchema.safeParse({
      empire_id: searchParams.get('empire_id'),
      category: searchParams.get('category') ?? undefined,
      difficulty: searchParams.get('difficulty') ?? undefined,
      verified: searchParams.get('verified') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid quiz search' },
        { status: 400 }
      );
    }

    const result = await searchQuizQuestions({
      empireId: parsed.data.empire_id,
      category: parsed.data.category,
      difficulty: parsed.data.difficulty,
      verified:
        parsed.data.verified === undefined
          ? undefined
          : parsed.data.verified === 'true',
      search: parsed.data.search,
      page: parsed.data.page,
      limit: parsed.data.limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Search quiz questions API error:', error);

    return NextResponse.json(
      { error: 'Failed to search questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const json = await request.json();
    const parsed = createSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    const question = await createQuizQuestion(parsed.data);

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Create quiz question API error:', error);

    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
