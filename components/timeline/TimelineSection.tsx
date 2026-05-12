'use client';

import { useMemo, useState } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';
import { ReportError } from '@/components/shared/ReportError';
import { InteractiveTimeline } from './InteractiveTimeline';
import TimelineErrorBoundary from './TimelineErrorBoundary';

type CategoryFilter = 'all' | string;

interface TimelineSectionProps {
  empire: EmpireConfig;
  events: TimelineEvent[];
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function TimelineSection({ empire, events }: TimelineSectionProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filters = useMemo(() => {
    const categories = Array.from(
      new Set(events.map((event) => event.category).filter(Boolean))
    ).sort((left, right) => left.localeCompare(right));

    return [
      { value: 'all', label: 'All Events' },
      ...categories.map((category) => ({
        value: category,
        label: formatCategoryLabel(category),
      })),
    ];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return events;
    return events.filter((event) => event.category === activeFilter);
  }, [activeFilter, events]);

  return (
    <section className="px-1 pb-12 sm:px-2">
      <div className="mb-6 flex flex-wrap gap-3 px-2 sm:px-0">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className="rounded-lg border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2"
              style={
                isActive
                  ? {
                      backgroundColor: `${empire.color}22`,
                      borderColor: empire.color,
                      color: empire.color,
                      boxShadow: `inset 0 0 0 1px ${empire.color}`,
                      ['--tw-ring-color' as string]: empire.color,
                    }
                  : {
                      backgroundColor: 'transparent',
                      borderColor: '#8B7355',
                      color: '#8B7355',
                      ['--tw-ring-color' as string]: empire.color,
                    }
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <p className="mb-4 px-2 text-sm text-[#B9AA8E] sm:px-0">
        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
      </p>

      {filteredEvents.length === 0 ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-[#8B7355] bg-[#1a1815]">
          <p className="text-[#8B7355]">
            No{' '}
            {activeFilter === 'all'
              ? ''
              : `${formatCategoryLabel(activeFilter)} `}{' '}
            events found
          </p>
        </div>
      ) : (
        <TimelineErrorBoundary>
          <InteractiveTimeline
            key={activeFilter}
            empire={empire}
            events={filteredEvents}
            selectedCategory={activeFilter}
          />
        </TimelineErrorBoundary>
      )}

      <div className="mt-8 flex justify-center">
        <ReportError
          empire={empire.name}
          page="Timeline"
          context={{
            total_events: events.length,
            active_filter: activeFilter,
          }}
        />
      </div>
    </section>
  );
}
