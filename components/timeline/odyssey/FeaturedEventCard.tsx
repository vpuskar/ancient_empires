'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EventCard from '@/components/timeline/odyssey/EventCard';
import EventClusterToggle from '@/components/timeline/odyssey/EventClusterToggle';
import type { TimelineEvent } from '@/lib/types/timeline';
import { formatYear } from '@/lib/utils/year';

interface FeaturedEventCardProps {
  event: TimelineEvent;
  cluster: TimelineEvent[];
}

export default function FeaturedEventCard({
  event,
  cluster,
}: FeaturedEventCardProps) {
  const [showCluster, setShowCluster] = useState(false);

  return (
    <div className="relative rounded-lg border border-amber-400/60 bg-zinc-900 p-5 shadow-[0_0_24px_-8px_rgba(251,191,36,0.35)]">
      <div className="absolute bottom-3 left-0 top-3 w-1 rounded-r-sm bg-amber-400" />

      <h3 className="text-base font-bold uppercase leading-tight tracking-wide text-amber-400">
        {formatYear(event.year)}
        {' // '}
        {event.title.toUpperCase()}
      </h3>

      {event.description ? (
        <blockquote className="mt-3 border-l-2 border-amber-400/30 pl-4 text-sm italic leading-relaxed text-zinc-200">
          “{event.description}”
        </blockquote>
      ) : null}

      {cluster.length > 0 ? (
        <>
          <EventClusterToggle
            count={cluster.length}
            isOpen={showCluster}
            onToggle={() => setShowCluster((value) => !value)}
          />

          <AnimatePresence>
            {showCluster && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="mt-3 space-y-2 pl-4">
                  {cluster.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}
