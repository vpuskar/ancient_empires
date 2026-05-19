import EventCard from '@/components/timeline/odyssey/EventCard';
import type { TimelineChapter } from '@/lib/types/timeline';

interface ChapterSectionProps {
  chapter: TimelineChapter;
}

export default function ChapterSection({ chapter }: ChapterSectionProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold uppercase leading-tight tracking-wide text-amber-400">
          {chapter.subtitle ?? chapter.title}
        </h2>
      </div>

      {chapter.events.length > 0 ? (
        <div className="space-y-3">
          {chapter.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
