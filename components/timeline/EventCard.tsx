'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';

type TimelineEventWithImage = TimelineEvent & {
  image_url?: string | null;
};

interface EventCardProps {
  empire: EmpireConfig;
  event: TimelineEventWithImage;
  left: number;
  top: number;
  onClose: () => void;
}

const CATEGORY_BADGES: Record<string, string> = {
  political: 'border-amber-500/40 bg-amber-100 text-amber-900',
  military: 'border-red-500/40 bg-red-100 text-red-900',
  cultural: 'border-blue-500/40 bg-blue-100 text-blue-900',
  religious: 'border-purple-500/40 bg-purple-100 text-purple-900',
  economic: 'border-green-500/40 bg-green-100 text-green-900',
  natural: 'border-slate-500/40 bg-slate-100 text-slate-800',
};

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year > 0) return `${year} AD`;
  return '0';
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getFirstSentence(description: string | null): string {
  if (!description) return 'No description available.';

  const trimmed = description.trim();
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return match?.[0]?.trim() || trimmed;
}

export function EventCard({
  empire,
  event,
  left,
  top,
  onClose,
}: EventCardProps) {
  const imageUrl = event.image_url ?? null;
  const badgeClass =
    CATEGORY_BADGES[event.category] ??
    'border-stone-400/50 bg-stone-100 text-stone-800';

  useEffect(() => {
    function handleKeyDown(keyEvent: KeyboardEvent) {
      if (keyEvent.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <button
      type="button"
      aria-label={`Close ${event.name} event card`}
      onClick={onClose}
      className="absolute z-20 block w-[min(21rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg bg-white text-left text-stone-950 shadow-2xl ring-1 ring-black/10 focus:outline-none focus:ring-2"
      style={{
        left,
        top,
        ['--tw-ring-color' as string]: empire.color,
      }}
    >
      <div className="grid gap-0 overflow-hidden rounded-lg sm:grid-cols-[7.5rem_1fr]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${event.name} illustration`}
            width={160}
            height={140}
            className="h-32 w-full object-cover sm:h-full"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-28 w-full sm:h-full"
            style={{
              background: `linear-gradient(135deg, ${empire.color}2E, ${empire.color}0F), repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,0.05) 10px 11px)`,
            }}
          />
        )}

        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {formatYear(event.year)}
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}
            >
              {formatCategoryLabel(event.category)}
            </span>
          </div>

          <h2 className="text-base font-semibold leading-tight text-stone-950">
            {event.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">
            {getFirstSentence(event.description)}
          </p>
        </div>
      </div>
    </button>
  );
}
