'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ChapterSection from '@/components/timeline/odyssey/ChapterSection';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineData } from '@/lib/types/timeline';

const HEADER_OFFSET = 72;

export interface OdysseyPanelHandle {
  jumpToChapter: (index: number) => void;
}

interface OdysseyPanelProps {
  empire: EmpireConfig;
  data: TimelineData;
  onActiveChange: (index: number) => void;
  onTitleClick: (index: number) => void;
}

const OdysseyPanel = forwardRef<OdysseyPanelHandle, OdysseyPanelProps>(
  function OdysseyPanel({ empire, data, onActiveChange, onTitleClick }, ref) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const lastActiveRef = useRef<number>(0);

    useImperativeHandle(
      ref,
      () => ({
        jumpToChapter: (index: number) => {
          const target = sectionRefs.current[index];
          const container = scrollContainerRef.current;
          if (!target || !container) return;

          const targetRect = target.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const offset =
            targetRect.top - containerRect.top + container.scrollTop;

          container.scrollTo({
            top: Math.max(0, offset - HEADER_OFFSET),
            behavior: 'smooth',
          });
        },
      }),
      []
    );

    useEffect(() => {
      if (data.chapters.length === 0) return;
      const container = scrollContainerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const intersecting = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => ({
              index: Number(
                (entry.target as HTMLElement).dataset.chapterIndex ?? '-1'
              ),
              top: entry.boundingClientRect.top,
            }))
            .filter((chapter) => chapter.index >= 0)
            .sort((a, b) => a.top - b.top);

          if (intersecting.length === 0) return;

          const next = intersecting[0].index;
          if (next === lastActiveRef.current) return;
          lastActiveRef.current = next;
          onActiveChange(next);
        },
        {
          root: container,
          rootMargin: `-${HEADER_OFFSET}px 0px -66% 0px`,
          threshold: 0,
        }
      );

      sectionRefs.current.forEach((element) => {
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }, [data.chapters.length, onActiveChange]);

    return (
      <div ref={scrollContainerRef} className="h-full overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 px-8 py-6 backdrop-blur">
          <div className="text-xs font-semibold tracking-widest text-zinc-500">
            {empire.name.toUpperCase()}: THE ODYSSEY
          </div>
        </header>

        <div className="space-y-12 px-8 pb-24 pt-8">
          {data.chapters.length > 0 ? (
            data.chapters.map((chapter, index) => (
              <ChapterSection
                key={chapter.id}
                ref={(element) => {
                  sectionRefs.current[index] = element;
                }}
                chapter={chapter}
                index={index}
                onTitleClick={onTitleClick}
              />
            ))
          ) : (
            <div className="italic text-zinc-500">No timeline content yet.</div>
          )}
        </div>
      </div>
    );
  }
);

export default OdysseyPanel;
