import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, isAdmin } from '@/lib/auth/admin';
import { createChapter } from '@/lib/services/chapters';

const chapterCreateSchema = z.object({
  empire_id: z.number().int().min(1).max(4),
  slug: z.string().min(1),
  title: z.string().min(1),
  sort_order: z.number().int(),
  content_md: z.string().min(1),
  period_start: z.number().int().nullable().optional(),
  period_end: z.number().int().nullable().optional(),
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

export async function POST(request: Request) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const json = await request.json();
    const parsed = chapterCreateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid chapter' }, { status: 400 });
    }

    const chapter = await createChapter(parsed.data);

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error('Create chapter API error:', error);

    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    );
  }
}
