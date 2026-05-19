'use client';

import { forwardRef, useMemo } from 'react';
import EventCard from '@/components/timeline/odyssey/EventCard';
import FeaturedEventCard from '@/components/timeline/odyssey/FeaturedEventCard';
import type { TimelineChapter } from '@/lib/types/timeline';
import { organizeChapterEvents } from '@/lib/utils/odyssey-clustering';

interface ChapterSectionProps {
  chapter: TimelineChapter;
  index: number;
  onTitleClick: (index: number) => void;
}

const ChapterSection = forwardRef<HTMLElement, ChapterSectionProps>(
  function ChapterSection({ chapter, index, onTitleClick }, ref) {
    const display = useMemo(
      () => organizeChapterEvents(chapter.events),
      [chapter.events]
    );

    return (
      <section ref={ref} data-chapter-index={index}>
        <button
          type="button"
          onClick={() => onTitleClick(index)}
          className="mb-6 block w-full cursor-pointer text-left transition-opacity hover:opacity-90"
        >
          <h2 className="text-2xl font-bold uppercase leading-tight tracking-wide text-amber-400">
            {chapter.subtitle ?? chapter.title}
          </h2>
        </button>

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
);

export default ChapterSection;
