'use client';

import { useMemo } from 'react';
import EventCard from '@/components/timeline/odyssey/EventCard';
import FeaturedEventCard from '@/components/timeline/odyssey/FeaturedEventCard';
import type { TimelineChapter } from '@/lib/types/timeline';
import { organizeChapterEvents } from '@/lib/utils/odyssey-clustering';

interface ChapterSectionProps {
  chapter: TimelineChapter;
}

export default function ChapterSection({ chapter }: ChapterSectionProps) {
  const display = useMemo(
    () => organizeChapterEvents(chapter.events),
    [chapter.events]
  );

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold uppercase leading-tight tracking-wide text-amber-400">
        {chapter.subtitle ?? chapter.title}
      </h2>

      {display.prelude.length > 0 || display.clusters.length > 0 ? (
        <>
          {display.prelude.length > 0 ? (
            <div className="mb-4 space-y-3">
              {display.prelude.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : null}

          {display.clusters.map((eventCluster) => (
            <div key={eventCluster.anchor.id} className="mb-6">
              <FeaturedEventCard
                event={eventCluster.anchor}
                cluster={eventCluster.cluster}
              />
            </div>
          ))}
        </>
      ) : null}
    </section>
  );
}
