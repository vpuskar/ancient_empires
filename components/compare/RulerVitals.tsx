'use client';

import { useEffect, useRef, useState } from 'react';

import type { RulerAtYear } from '@/lib/types/compare';

interface RulerVitalsProps {
  empireId: number;
  year: number;
  empireColor: string;
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

function formatReign(start: number, end: number | null): string {
  return `${formatYear(start)} ${end === null ? '– present' : `– ${formatYear(end)}`}`;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');
}

export default function RulerVitals({
  empireId,
  year,
  empireColor,
}: RulerVitalsProps) {
  const [ruler, setRuler] = useState<RulerAtYear | null>(null);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      fetch(`/api/compare/ruler?empireId=${empireId}&year=${year}`, {
        signal: controller.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch ruler');
          }

          return response.json() as Promise<RulerAtYear | null>;
        })
        .then((nextRuler) => {
          if (controller.signal.aborted) {
            return;
          }

          setRuler(nextRuler);
          setLoading(false);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }

          setRuler(null);
          setLoading(false);
        });

      debounceRef.current = null;
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      abortRef.current?.abort();
    };
  }, [empireId, year]);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-3/4 rounded bg-stone-200" />
        <div className="h-3 w-1/2 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-200" />
      </div>
    );
  }

  if (!ruler) {
    return (
      <p className="text-sm text-stone-500">
        No ruler recorded for this period.
      </p>
    );
  }

  return (
    <div
      className="space-y-4 border-l-4 pl-4"
      style={{ borderColor: empireColor }}
    >
      <div className="flex gap-3">
        {ruler.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="h-12 w-12 rounded-full object-cover"
            src={ruler.image_url}
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${empireColor}33`,
              color: empireColor,
            }}
          >
            {getInitials(ruler.name)}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="font-medium text-stone-950">{ruler.name}</h3>
          {ruler.native_name ? (
            <p className="text-sm text-stone-500">{ruler.native_name}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ruler.dynasty ? (
          <span
            className="rounded-full px-2 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${empireColor}26`,
              color: empireColor,
            }}
          >
            {ruler.dynasty}
          </span>
        ) : null}
        <span className="text-xs text-stone-500">
          {formatReign(ruler.reign_start, ruler.reign_end)}
        </span>
      </div>

      {ruler.bio_short ? (
        <div className="space-y-1">
          <p className="text-xs italic text-stone-500">Claim to fame</p>
          <p className="text-sm leading-6 text-stone-700">{ruler.bio_short}</p>
        </div>
      ) : null}
    </div>
  );
}
