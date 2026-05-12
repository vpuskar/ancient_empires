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
    <section className="relative pb-10">
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
        <div className="relative">
          <div className="absolute left-4 right-4 top-20 z-40 flex flex-col gap-3 md:left-6 md:right-auto md:top-36 md:max-w-[calc(100%-9rem)]">
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/42 p-2 shadow-2xl backdrop-blur-md">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setActiveFilter(filter.value)}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 md:text-sm"
                    style={
                      isActive
                        ? {
                            backgroundColor: `${empire.color}55`,
                            borderColor: '#f5c967',
                            color: '#fff4c8',
                            boxShadow: `0 0 18px ${empire.color}55`,
                            ['--tw-ring-color' as string]: empire.color,
                          }
                        : {
                            backgroundColor: 'rgba(0,0,0,0.28)',
                            borderColor: 'rgba(245, 230, 189, 0.18)',
                            color: '#d9ccb1',
                            ['--tw-ring-color' as string]: empire.color,
                          }
                    }
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            <p className="w-fit rounded-full border border-white/10 bg-black/36 px-3 py-1 text-xs font-medium text-[#f5e6bd]/78 backdrop-blur-md">
              {filteredEvents.length} event
              {filteredEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          <TimelineErrorBoundary>
            <InteractiveTimeline
              key={activeFilter}
              empire={empire}
              events={filteredEvents}
              selectedCategory={activeFilter}
            />
          </TimelineErrorBoundary>
        </div>
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
