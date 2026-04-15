'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimelineEvent } from '@/lib/services/events';

const CATEGORY_COLORS: Record<string, string> = {
  political: '#C9A84C',
  military: '#8B0000',
  cultural: '#9370DB',
};

const CATEGORY_ICONS: Record<string, string> = {
  political: 'C',
  military: 'M',
  cultural: 'A',
};

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
}

interface Props {
  event: TimelineEvent;
  onClose: () => void;
}

export function EventDetailCard({ event, onClose }: Props) {
  const color = CATEGORY_COLORS[event.category] ?? '#C9A84C';

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-lg rounded-xl border border-[#8B7355] bg-[#0C0B09]/95 p-6 shadow-2xl backdrop-blur-lg max-md:max-h-[90vh] max-md:overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#8B7355] transition hover:bg-[#8B7355]/20 hover:text-[#F0ECE2]"
          >
            x
          </button>

          <div className="mb-4 flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${color}22`,
                color: color,
                border: `1px solid ${color}`,
              }}
            >
              {CATEGORY_ICONS[event.category] ?? '•'}{' '}
              {formatCategoryLabel(event.category)}
            </span>
            <span className="text-sm text-[#8B7355]">
              {formatYear(event.year)}
            </span>
          </div>

          <h2
            className="font-display text-2xl font-bold leading-tight"
            style={{ color }}
          >
            {event.name}
          </h2>

          {event.description && (
            <p className="mt-3 leading-relaxed text-[#F0ECE2]/80">
              {event.description}
            </p>
          )}

          {event.ruler && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#8B7355]/40 bg-[#1a1815] p-3">
              {event.ruler.image_url ? (
                <Image
                  src={event.ruler.image_url}
                  alt={event.ruler.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-[#8B7355] object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8B7355] bg-[#0C0B09] text-sm text-[#8B7355]">
                  {event.ruler.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs text-[#8B7355]">Ruler</p>
                <p className="text-sm font-medium text-[#F0ECE2]">
                  {event.ruler.name}
                </p>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-1">
            <span className="mr-2 text-xs text-[#8B7355]">Significance</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="text-sm"
                style={{
                  color: i < event.significance ? '#C9A84C' : '#8B7355',
                  opacity: i < event.significance ? 1 : 0.3,
                }}
              >
                *
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
