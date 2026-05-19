'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ChapterDotStrip from '@/components/timeline/odyssey/ChapterDotStrip';
import OdysseyHero from '@/components/timeline/odyssey/OdysseyHero';
import OdysseyPanel from '@/components/timeline/odyssey/OdysseyPanel';
import type { OdysseyPanelHandle } from '@/components/timeline/odyssey/OdysseyPanel';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineData } from '@/lib/types/timeline';

interface OdysseyCanvasProps {
  empire: EmpireConfig;
  data: TimelineData;
  emptyMessage?: string;
}

export default function OdysseyCanvas({
  empire,
  data,
  emptyMessage,
}: OdysseyCanvasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<OdysseyPanelHandle>(null);

  const activeChapter = data.chapters[activeIndex] ?? null;

  const goToChapter = useCallback(
    (index: number) => {
      if (index < 0 || index >= data.chapters.length) return;
      setActiveIndex(index);
      panelRef.current?.jumpToChapter(index);
    },
    [data.chapters.length]
  );

  useEffect(() => {
    if (data.chapters.length === 0) return;

    function handleKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;

      if (
        target.closest(
          'input, textarea, select, button, a, [role="button"], [contenteditable="true"]'
        )
      ) {
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        goToChapter(Math.min(data.chapters.length - 1, activeIndex + 1));
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        goToChapter(Math.max(0, activeIndex - 1));
      } else if (event.key === 'Home') {
        event.preventDefault();
        goToChapter(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goToChapter(data.chapters.length - 1);
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, data.chapters.length, goToChapter]);

  return (
    <main className="flex flex-col bg-zinc-950 text-white lg:h-screen lg:flex-row lg:overflow-hidden">
      <section className="relative h-[40vh] w-full flex-shrink-0 lg:h-full lg:w-3/5">
        <OdysseyHero empire={empire} chapter={activeChapter} />
        {data.chapters.length > 0 ? (
          <ChapterDotStrip
            chapters={data.chapters}
            activeIndex={activeIndex}
            onDotClick={goToChapter}
          />
        ) : null}
      </section>

      <section className="w-full lg:h-full lg:w-2/5 lg:flex-1">
        <OdysseyPanel
          ref={panelRef}
          empire={empire}
          data={data}
          emptyMessage={emptyMessage}
          onActiveChange={setActiveIndex}
          onTitleClick={goToChapter}
        />
      </section>
    </main>
  );
}
