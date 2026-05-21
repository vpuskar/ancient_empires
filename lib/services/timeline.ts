import { AppError } from '@/lib/errors';
import { getEventsWithRulers } from '@/lib/services/events';
import { createClient } from '@/lib/supabase/server';
import type {
  TimelineChapter,
  TimelineData,
  TimelineEvent,
} from '@/lib/types/timeline';

type ChapterQueryRow = {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  period_start: number | null;
  period_end: number | null;
  hero_image_url: string | null;
  sort_order: number;
};

function assertQuery<T extends { error: { message: string } | null }>(
  result: T,
  code: string
): T {
  if (result.error) {
    throw new AppError(result.error.message, code, 500);
  }

  return result;
}

function toTimelineEvent(
  event: Awaited<ReturnType<typeof getEventsWithRulers>>[number]
): TimelineEvent {
  return {
    id: event.id,
    year: event.year,
    title: (event as { title?: string; name: string }).title ?? event.name,
    description: event.description,
    category: event.category,
    significance: event.significance,
    ruler_id: event.ruler_id,
    ruler_name: event.ruler?.name ?? null,
    is_featured: event.significance === 5,
  };
}

function createTimelineChapter(chapter: ChapterQueryRow): TimelineChapter {
  return {
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    subtitle: chapter.subtitle,
    period_start: chapter.period_start,
    period_end: chapter.period_end,
    hero_image_url: chapter.hero_image_url,
    sort_order: chapter.sort_order,
    events: [],
  };
}

export async function getTimelineByEmpire(
  empireId: number
): Promise<TimelineData> {
  const supabase = await createClient();

  const chaptersResult = await supabase
    .from('chapters')
    .select(
      'id, slug, title, subtitle, period_start, period_end, hero_image_url, sort_order'
    )
    .eq('empire_id', empireId)
    .order('sort_order', { ascending: true });

  const chapters = (
    (assertQuery(chaptersResult, 'TIMELINE_CHAPTERS_FETCH').data ??
      []) as ChapterQueryRow[]
  ).map(createTimelineChapter);

  const events = (await getEventsWithRulers(supabase, empireId)).map(
    toTimelineEvent
  );

  events.forEach((event) => {
    const chapter = chapters.find((candidate) => {
      const startsOk =
        candidate.period_start === null || event.year >= candidate.period_start;
      const endsOk =
        candidate.period_end === null || event.year <= candidate.period_end;

      return startsOk && endsOk;
    });

    chapter?.events.push(event);
  });

  chapters.forEach((chapter) => {
    chapter.events.sort((a, b) => a.year - b.year || a.id - b.id);
  });

  return { chapters };
}
