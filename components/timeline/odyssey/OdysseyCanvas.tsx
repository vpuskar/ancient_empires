'use client';

import { useCallback, useRef, useState } from 'react';
import ChapterDotStrip from '@/components/timeline/odyssey/ChapterDotStrip';
import OdysseyHero from '@/components/timeline/odyssey/OdysseyHero';
import OdysseyPanel from '@/components/timeline/odyssey/OdysseyPanel';
import type { OdysseyPanelHandle } from '@/components/timeline/odyssey/OdysseyPanel';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineData } from '@/lib/types/timeline';

interface OdysseyCanvasProps {
  empire: EmpireConfig;
  data: TimelineData;
}

export default function OdysseyCanvas({ empire, data }: OdysseyCanvasProps) {
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

  return (
    <main className="flex flex-col bg-zinc-950 text-white lg:h-screen lg:flex-row lg:overflow-hidden">
      <section className="relative h-[50vh] lg:h-full lg:w-[60%]">
        <OdysseyHero empire={empire} chapter={activeChapter} />
        {data.chapters.length > 0 ? (
          <ChapterDotStrip
            chapters={data.chapters}
            activeIndex={activeIndex}
            onDotClick={goToChapter}
          />
        ) : null}
      </section>

      <section className="lg:h-full lg:w-[40%] lg:flex-1">
        <OdysseyPanel
          ref={panelRef}
          empire={empire}
          data={data}
          onActiveChange={setActiveIndex}
          onTitleClick={goToChapter}
        />
      </section>
    </main>
  );
}
