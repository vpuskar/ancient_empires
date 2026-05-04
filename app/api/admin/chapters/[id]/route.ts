import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser, isAdmin } from '@/lib/auth/admin';
import { deleteChapter, updateChapter } from '@/lib/services/chapters';

const chapterUpdateSchema = z
  .object({
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    sort_order: z.number().int().optional(),
    content_md: z.string().min(1).optional(),
    period_start: z.number().int().nullable().optional(),
    period_end: z.number().int().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0);

interface ChapterRouteContext {
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

async function parseChapterId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const chapterId = Number(id);

  if (!Number.isInteger(chapterId) || chapterId <= 0) {
    return null;
  }

  return chapterId;
}

export async function PUT(request: Request, { params }: ChapterRouteContext) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const chapterId = await parseChapterId(params);

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Invalid chapter id' },
        { status: 400 }
      );
    }

    const json = await request.json();
    const parsed = chapterUpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid chapter' }, { status: 400 });
    }

    const chapter = await updateChapter(chapterId, parsed.data);

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('Update chapter API error:', error);

    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: ChapterRouteContext
) {
  try {
    const auth = await requireApiAdmin();

    if ('response' in auth) {
      return auth.response;
    }

    const chapterId = await parseChapterId(params);

    if (!chapterId) {
      return NextResponse.json(
        { error: 'Invalid chapter id' },
        { status: 400 }
      );
    }

    await deleteChapter(chapterId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete chapter API error:', error);

    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    );
  }
}
