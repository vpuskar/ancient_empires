'use client';

import { useEffect } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';

type TimelineEventWithImage = TimelineEvent & {
  image_url?: string | null;
};

interface EventCardProps {
  empire: EmpireConfig;
  event: TimelineEventWithImage;
  leftPercent: number;
  topPercent: number;
  onClose: () => void;
}

const CATEGORY_BADGES: Record<string, string> = {
  political: 'border-amber-300/35 bg-amber-300/15 text-amber-100',
  military: 'border-red-300/35 bg-red-400/15 text-red-100',
  cultural: 'border-blue-300/35 bg-blue-400/15 text-blue-100',
  religious: 'border-purple-300/35 bg-purple-400/15 text-purple-100',
  economic: 'border-green-300/35 bg-green-400/15 text-green-100',
  natural: 'border-slate-300/35 bg-slate-400/15 text-slate-100',
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
  leftPercent,
  topPercent,
  onClose,
}: EventCardProps) {
  const imageUrl = event.image_url ?? event.ruler?.image_url ?? null;
  const badgeClass =
    CATEGORY_BADGES[event.category] ??
    'border-stone-300/35 bg-stone-400/15 text-stone-100';

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
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`${event.name} event details`}
      onClick={(clickEvent) => clickEvent.stopPropagation()}
      className="absolute z-40 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#080b0d]/82 text-[#fff8df] shadow-[0_24px_80px_rgba(0,0,0,0.72)] backdrop-blur-xl"
      style={{
        left: `${Math.min(86, Math.max(14, leftPercent))}%`,
        top:
          topPercent > 56
            ? `calc(${Math.max(18, topPercent - 42)}% - 1rem)`
            : `calc(${Math.min(70, topPercent + 5)}% + 1rem)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l border-t border-white/15 bg-[#080b0d]/82"
      />

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`${event.name} illustration`}
          className="h-40 w-full object-cover opacity-90"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-40 w-full items-center justify-center border-b border-[#e8c987]/18 text-5xl font-bold text-[#f6ddb0]/82 sepia"
          style={{
            background: `radial-gradient(circle at 28% 35%, rgba(255,239,194,0.2), transparent 22%), radial-gradient(circle at 72% 44%, ${empire.color}66, transparent 28%), linear-gradient(135deg, rgba(93,58,25,0.96), rgba(24,17,11,0.98)), repeating-linear-gradient(35deg, transparent 0 14px, rgba(255,255,255,0.055) 14px 15px)`,
          }}
        >
          {event.name.charAt(0)}
        </div>
      )}

      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c967]">
            {formatYear(event.year)}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}
          >
            {formatCategoryLabel(event.category)}
          </span>
        </div>

        <h2 className="text-lg font-semibold leading-tight text-white">
          {event.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#d9ccb1]">
          {getFirstSentence(event.description)}
        </p>

        {event.ruler && (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[#f5e6bd]/55">
            {event.ruler.name}
          </p>
        )}
      </div>

      <button
        type="button"
        aria-label="Close event card"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-sm font-semibold text-white shadow-lg transition hover:bg-black/80 focus:outline-none focus:ring-2"
        style={{ ['--tw-ring-color' as string]: empire.color }}
      >
        Close
      </button>
    </div>
  );
}
