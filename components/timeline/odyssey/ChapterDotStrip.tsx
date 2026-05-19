'use client';

import type { TimelineChapter } from '@/lib/types/timeline';

interface ChapterDotStripProps {
  chapters: TimelineChapter[];
  activeIndex: number;
  onDotClick: (index: number) => void;
}

export default function ChapterDotStrip({
  chapters,
  activeIndex,
  onDotClick,
}: ChapterDotStripProps) {
  return (
    <div
      className="absolute bottom-6 left-6 z-20 flex flex-col gap-2"
      aria-label="Chapter navigation"
      role="group"
    >
      {chapters.map((chapter, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onDotClick(index)}
            aria-label={`Jump to: ${chapter.subtitle ?? chapter.title}`}
            aria-current={isActive ? 'true' : undefined}
            className={
              `h-2 w-2 rounded-full transition-all duration-200 ` +
              (isActive
                ? 'scale-125 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                : 'bg-zinc-600 hover:bg-zinc-400')
            }
          />
        );
      })}
    </div>
  );
}
