'use client';

import { useState, useMemo } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';
import { HorizontalTimeline } from './HorizontalTimeline';
import TimelineErrorBoundary from './TimelineErrorBoundary';

type CategoryFilter = 'all' | 'political' | 'military' | 'cultural';

const FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'political', label: 'Political' },
  { value: 'military', label: 'Military' },
  { value: 'cultural', label: 'Cultural' },
];

interface Props {
  empire: EmpireConfig;
  events: TimelineEvent[];
}

export function TimelineContainer({ empire, events }: Props) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return events;
    return events.filter((e) => e.category === activeFilter);
  }, [events, activeFilter]);

  return (
    <div className="px-6 pb-12">
      {/* Filter buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition"
              style={
                isActive
                  ? {
                      backgroundColor: `${empire.color}22`,
                      borderColor: empire.color,
                      color: empire.color,
                      boxShadow: `inset 0 0 0 1px ${empire.color}`,
                    }
                  : {
                      backgroundColor: 'transparent',
                      borderColor: '#8B7355',
                      color: '#8B7355',
                    }
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Event count */}
      <p className="mb-4 text-sm text-[#8B7355]">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
      </p>

      {/* Timeline or empty state */}
      {filteredEvents.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-[#8B7355] bg-[#1a1815]">
          <p className="text-[#8B7355]">
            No {activeFilter === 'all' ? '' : activeFilter} events found
          </p>
        </div>
      ) : (
        <TimelineErrorBoundary>
          <HorizontalTimeline events={filteredEvents} empire={empire} />
        </TimelineErrorBoundary>
      )}
    </div>
  );
}
