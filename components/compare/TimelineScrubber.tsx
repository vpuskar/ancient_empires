'use client';

import { useEffect, useRef } from 'react';

import {
  APEX_SNAPS,
  SCRUBBER_MAX,
  SCRUBBER_MIN,
} from '@/lib/config/compare/scrubber';

interface TimelineScrubberProps {
  year: number;
  onChange: (year: number) => void;
}

function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }

  if (year === 0) {
    return '1 BC';
  }

  return `${year} AD`;
}

function getYearPosition(year: number): number {
  return ((year - SCRUBBER_MIN) / (SCRUBBER_MAX - SCRUBBER_MIN)) * 100;
}

export default function TimelineScrubber({
  year,
  onChange,
}: TimelineScrubberProps) {
  const isSnappingRef = useRef(false);

  useEffect(() => {
    if (isSnappingRef.current) {
      isSnappingRef.current = false;
      return;
    }

    const snap = APEX_SNAPS.find(
      (apex) => apex.year !== year && Math.abs(apex.year - year) <= 15
    );

    if (snap) {
      isSnappingRef.current = true;
      onChange(snap.year);
    }
  }, [onChange, year]);

  return (
    <div className="space-y-3">
      <div className="text-center text-sm font-semibold text-stone-800">
        {formatYear(year)}
      </div>

      <input
        aria-label="Compare timeline year"
        className="h-2 w-full cursor-pointer accent-stone-900"
        max={SCRUBBER_MAX}
        min={SCRUBBER_MIN}
        onChange={(event) => onChange(Number(event.target.value))}
        step={1}
        type="range"
        value={year}
      />

      <svg
        aria-hidden="true"
        className="h-8 w-full overflow-visible text-stone-500"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 100 24"
      >
        {APEX_SNAPS.map((apex) => {
          const x = getYearPosition(apex.year);

          return (
            <line
              key={`${apex.empire_id}-${apex.year}`}
              stroke="currentColor"
              strokeWidth={0.8}
              vectorEffect="non-scaling-stroke"
              x1={x}
              x2={x}
              y1={2}
              y2={18}
            >
              <title>{`${apex.label} (${formatYear(apex.year)})`}</title>
            </line>
          );
        })}
      </svg>
    </div>
  );
}
