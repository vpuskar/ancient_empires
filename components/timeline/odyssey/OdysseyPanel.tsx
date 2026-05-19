import ChapterSection from '@/components/timeline/odyssey/ChapterSection';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineData } from '@/lib/types/timeline';

interface OdysseyPanelProps {
  empire: EmpireConfig;
  data: TimelineData;
}

export default function OdysseyPanel({ empire, data }: OdysseyPanelProps) {
  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 px-8 py-6 backdrop-blur">
        <div className="text-xs font-semibold tracking-widest text-zinc-500">
          {empire.name.toUpperCase()}: THE ODYSSEY
        </div>
      </header>

      <div className="space-y-12 px-8 pb-24 pt-8">
        {data.chapters.length > 0 ? (
          data.chapters.map((chapter) => (
            <ChapterSection key={chapter.id} chapter={chapter} />
          ))
        ) : (
          <div className="italic text-zinc-500">No timeline content yet.</div>
        )}
      </div>
    </div>
  );
}
