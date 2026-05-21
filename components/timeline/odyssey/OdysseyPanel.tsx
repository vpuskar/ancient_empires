'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ChapterSection from '@/components/timeline/odyssey/ChapterSection';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineData } from '@/lib/types/timeline';

const HEADER_OFFSET = 72;

function isDesktopViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 1024px)').matches;
}

export interface OdysseyPanelHandle {
  jumpToChapter: (index: number) => void;
}

interface OdysseyPanelProps {
  empire: EmpireConfig;
  data: TimelineData;
  emptyMessage?: string;
  onActiveChange: (index: number) => void;
  onTitleClick: (index: number) => void;
}

const OdysseyPanel = forwardRef<OdysseyPanelHandle, OdysseyPanelProps>(
  function OdysseyPanel(
    { empire, data, emptyMessage, onActiveChange, onTitleClick },
    ref
  ) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const lastActiveRef = useRef<number>(0);

    useImperativeHandle(
      ref,
      () => ({
        jumpToChapter: (index: number) => {
          const target = sectionRefs.current[index];
          if (!target) return;

          if (isDesktopViewport()) {
            const container = scrollContainerRef.current;
            if (!container) return;

            const targetRect = target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const offset =
              targetRect.top - containerRect.top + container.scrollTop;

            container.scrollTo({
              top: Math.max(0, offset - HEADER_OFFSET),
              behavior: 'smooth',
            });
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        },
      }),
      []
    );

    useEffect(() => {
      if (data.chapters.length === 0) return;

      // Initial breakpoint classification at mount. Crossing the lg breakpoint
      // mid-session may yield best-effort behaviour until refresh.
      const desktop = isDesktopViewport();
      const root = desktop ? scrollContainerRef.current : null;
      if (desktop && !root) return;

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
          root,
          rootMargin: desktop
            ? `-${HEADER_OFFSET}px 0px -66% 0px`
            : '0px 0px -66% 0px',
          threshold: 0,
        }
      );

      sectionRefs.current.forEach((element) => {
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    }, [data.chapters.length, onActiveChange]);

    return (
      <div ref={scrollContainerRef} className="h-full lg:overflow-y-auto">
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
            <div className="italic text-zinc-500">
              {emptyMessage ?? 'No timeline content yet.'}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default OdysseyPanel;
