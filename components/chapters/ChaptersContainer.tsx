'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { EmpireConfig } from '@/lib/empires/config';
import type { Chapter } from '@/lib/services/chapters';
import { track } from '@/lib/posthog/track';
import { ChapterReader } from './ChapterReader';
import { TimelineDivider } from './LayoutBreaker';

function formatYear(year: number | null): string {
  if (year === null) return 'Unknown';
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatPeriodRange(
  start: number | null,
  end: number | null
): string | null {
  if (start === null && end === null) return null;
  if (start !== null && end !== null)
    return `${formatYear(start)} – ${formatYear(end)}`;
  if (start !== null) return `From ${formatYear(start)}`;
  return `Until ${formatYear(end)}`;
}

interface Props {
  empire: EmpireConfig;
  chapters: Chapter[];
}

export function ChaptersContainer({ empire, chapters = [] }: Props) {
  const [activeSlug, setActiveSlug] = useState<string>(chapters[0]?.slug ?? '');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const setRef = useCallback(
    (slug: string) => (el: HTMLElement | null) => {
      if (el) sectionRefs.current.set(slug, el);
      else sectionRefs.current.delete(slug);
    },
    []
  );

  // Intersection Observer for active chapter detection
  useEffect(() => {
    if (!chapters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = entry.target.getAttribute('data-slug');
            if (slug) setActiveSlug(slug);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    for (const el of sectionRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [chapters]);

  // Scroll progress
  useEffect(() => {
    function handleScroll() {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setScrollProgress(total > 0 ? Math.min(1, scrolled / total) : 0);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToChapter(slug: string) {
    const el = sectionRefs.current.get(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileNavOpen(false);
      track('chapter_viewed', { empire: empire.slug, chapter_slug: slug });
    }
  }

  if (!chapters.length) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-[#8B7355] bg-[#1a1815] mx-6">
        <p className="text-[#8B7355]">No chapters available for this empire</p>
      </div>
    );
  }

  return (
    <div className="relative px-6 pb-12">
      {/* Progress bar */}
      <div className="fixed left-0 top-0 z-40 h-0.5 w-full bg-[#0C0B09]">
        <motion.div
          className="h-full origin-left"
          style={{ backgroundColor: empire.color }}
          animate={{ scaleX: scrollProgress }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Mobile nav toggle */}
      <button
        onClick={() => setMobileNavOpen((o) => !o)}
        className="mb-4 flex items-center gap-2 rounded-lg border border-[#8B7355] bg-[#1a1815] px-4 py-2 text-sm text-[#F0ECE2] transition hover:border-[#C9A84C] md:hidden"
      >
        <span className="text-base">{mobileNavOpen ? '✕' : '☰'}</span>
        Chapter Navigation
      </button>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileNavOpen
              ? 'fixed inset-x-0 bottom-0 z-50 max-h-[60vh] overflow-y-auto rounded-t-2xl border-t border-[#8B7355] bg-[#0C0B09] p-4 shadow-2xl'
              : 'hidden'
          } md:block md:sticky md:top-6 md:self-start`}
        >
          {/* Mobile close header */}
          {mobileNavOpen && (
            <div className="mb-3 flex items-center justify-between md:hidden">
              <span className="text-sm font-medium text-[#C9A84C]">
                Chapters
              </span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="text-[#8B7355] hover:text-[#F0ECE2]"
              >
                ✕
              </button>
            </div>
          )}

          <p className="mb-1 text-xs tracking-widest text-[#8B7355] uppercase">
            Chapter Index
          </p>
          <p className="mb-4 text-xs text-[#8B7355]">
            {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
          </p>

          <nav className="space-y-1.5">
            {chapters.map((chapter) => {
              const isActive = activeSlug === chapter.slug;
              return (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(chapter.slug)}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm transition"
                  style={
                    isActive
                      ? {
                          backgroundColor: `${empire.color}15`,
                          borderLeft: `3px solid ${empire.color}`,
                          color: '#F0ECE2',
                        }
                      : {
                          borderLeft: '3px solid transparent',
                          color: '#8B7355',
                        }
                  }
                >
                  <span className="block font-medium">{chapter.title}</span>
                  {formatPeriodRange(
                    chapter.period_start,
                    chapter.period_end
                  ) && (
                    <span className="mt-0.5 block text-xs opacity-70">
                      {formatPeriodRange(
                        chapter.period_start,
                        chapter.period_end
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div ref={contentRef} className="space-y-0">
          {chapters.map((chapter, i) => (
            <div key={chapter.id}>
              {/* Divider between chapters */}
              {i > 0 && chapter.period_start !== null && (
                <TimelineDivider year={chapter.period_start} />
              )}

              <article
                ref={setRef(chapter.slug)}
                data-slug={chapter.slug}
                className="scroll-mt-8 rounded-xl border border-[#8B7355]/20 bg-[#1a1815]/60 p-6 md:p-8"
              >
                {/* Chapter header */}
                <header className="mb-6 border-b border-[#8B7355]/20 pb-5">
                  <p className="text-xs tracking-widest text-[#8B7355] uppercase">
                    Chapter {chapter.sort_order}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-[#F0ECE2]">
                    {chapter.title}
                  </h2>
                  {formatPeriodRange(
                    chapter.period_start,
                    chapter.period_end
                  ) && (
                    <p
                      className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: `${empire.color}15`,
                        color: empire.color,
                        border: `1px solid ${empire.color}30`,
                      }}
                    >
                      {formatPeriodRange(
                        chapter.period_start,
                        chapter.period_end
                      )}
                    </p>
                  )}
                </header>

                {/* Markdown content */}
                <ChapterReader content={chapter.content_md} delay={i * 0.05} />
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile nav backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </div>
  );
}
