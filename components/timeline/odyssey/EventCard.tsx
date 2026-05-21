'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { TimelineEvent } from '@/lib/types/timeline';
import { formatYear } from '@/lib/utils/year';

interface EventCardProps {
  event: TimelineEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);

  const content = (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm leading-snug text-zinc-300">
        <span className="font-semibold text-zinc-400">
          {formatYear(event.year)}:
        </span>{' '}
        {event.title}
      </span>
      {event.description ? (
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform duration-150 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      ) : null}
    </div>
  );

  if (!event.description) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-left transition-colors hover:bg-zinc-800"
    >
      {content}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {event.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
