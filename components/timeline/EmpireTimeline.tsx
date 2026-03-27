'use client';

import { useState } from 'react';
import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import type { EmpireConfig } from '@/lib/empires/config';
import type { Event } from '@/lib/services/events';

interface EmpireTimelineProps {
  empire: EmpireConfig;
  events: Event[];
}

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatDate(year: number, month: number | null): string {
  if (month === null) {
    return formatYear(year);
  }

  return `Month ${month}, ${formatYear(year)}`;
}

export function EmpireTimeline({ empire, events }: EmpireTimelineProps) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    events[0]?.id ?? null
  );

  const selectedEvent =
    selectedEventId === null
      ? null
      : events.find((event) => event.id === selectedEventId) ?? null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Timeline
          </p>
          <h1 className="text-4xl font-bold">{empire.name} Events</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Follow key events in chronological order and inspect each moment in a
            focused detail panel.
          </p>
        </header>

        <EmpireSectionNav empire={empire} />

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <p className="text-sm text-zinc-400">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Chronological timeline
            </p>
          </div>

          {events.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-400">
              No events found for this empire.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <div className="space-y-4">
                <div className="overflow-x-auto pb-2">
                  <div className="flex min-w-max items-start gap-4">
                    {events.map((event, index) => {
                      const isSelected = selectedEvent?.id === event.id;

                      return (
                        <div
                          key={event.id}
                          className="flex w-52 shrink-0 items-stretch gap-4"
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedEventId(event.id)}
                            className="group block w-full rounded-xl border border-zinc-800 bg-zinc-900/70 p-4 text-left transition hover:border-zinc-600 hover:bg-zinc-900"
                            style={
                              isSelected
                                ? {
                                    borderColor: empire.color,
                                    boxShadow: `inset 0 0 0 1px ${empire.color}`,
                                  }
                                : undefined
                            }
                          >
                            <p
                              className="text-xs font-semibold uppercase tracking-[0.18em]"
                              style={{
                                color: isSelected ? empire.color : '#a1a1aa',
                              }}
                            >
                              {formatYear(event.year)}
                            </p>
                            <h2 className="mt-3 line-clamp-3 text-base font-semibold text-white">
                              {event.title}
                            </h2>
                            <p className="mt-3 text-sm text-zinc-400">{event.category}</p>
                          </button>

                          {index < events.length - 1 ? (
                            <div className="flex items-center" aria-hidden="true">
                              <span
                                className="block h-px w-10 bg-zinc-800"
                                style={{
                                  backgroundColor: isSelected ? `${empire.color}80` : undefined,
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedEvent ? (
                <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:sticky lg:top-6 lg:self-start">
                  <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                    Selected event
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-white">
                    {selectedEvent.title}
                  </h2>

                  <div className="mt-5 space-y-3 text-sm text-zinc-300">
                    <p>
                      <span className="text-zinc-500">Date:</span>{' '}
                      {formatDate(selectedEvent.year, selectedEvent.month)}
                    </p>
                    <p>
                      <span className="text-zinc-500">Category:</span>{' '}
                      {selectedEvent.category}
                    </p>
                    <p>
                      <span className="text-zinc-500">Significance:</span>{' '}
                      {selectedEvent.significance === null
                        ? 'Unknown'
                        : selectedEvent.significance}
                    </p>
                  </div>

                  <p className="mt-6 leading-7 text-zinc-300">
                    {selectedEvent.description ?? 'No description available.'}
                  </p>
                </aside>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
