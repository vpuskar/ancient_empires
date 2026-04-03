'use client';

import { useEffect, useState } from 'react';
import type { TimelineSnapshot } from '@/lib/types/territorial';

interface StoryStripProps {
  snapshot: TimelineSnapshot;
  empireColor: string;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const parsed = Number.parseInt(value, 16);

  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${alpha})`;
}

export function StoryStrip({ snapshot, empireColor }: StoryStripProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 0);
    const showTimer = window.setTimeout(() => setVisible(true), 150);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
    };
  }, [snapshot]);

  return (
    <div
      className="mx-auto w-full max-w-[600px] rounded-[8px] border px-5 py-3 transition-opacity duration-300 sm:px-5 sm:py-3"
      style={{
        opacity: visible ? 1 : 0,
        backgroundColor: hexToRgba(empireColor, 0.06),
        borderColor: hexToRgba(empireColor, 0.15),
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
            style={{
              backgroundColor: empireColor,
              boxShadow: `0 0 12px ${hexToRgba(empireColor, 0.6)}`,
            }}
          />
          <div className="min-w-0">
            <p className="font-display text-[14px] tracking-[0.14em] uppercase text-[#F5E6C8]">
              {snapshot.storyTitle}
            </p>
            <p
              className="mt-1 font-body text-[14px] italic leading-relaxed text-[#9A8B70]"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {snapshot.storySummary}
            </p>
          </div>
        </div>

        {snapshot.ruler ? (
          <div className="shrink-0 pl-5 font-body text-[13px] text-[#6B5B47] sm:pl-4 sm:text-right">
            {snapshot.ruler}
          </div>
        ) : null}
      </div>
    </div>
  );
}
