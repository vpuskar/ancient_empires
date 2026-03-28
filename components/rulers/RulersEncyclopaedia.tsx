'use client';

import { useMemo, useState } from 'react';
import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import type { EmpireConfig } from '@/lib/empires/config';
import type { Ruler } from '@/lib/services/rulers';
import { track } from '@/lib/posthog/track';

interface RulersEncyclopaediaProps {
  empire: EmpireConfig;
  rulers: Ruler[];
}

type SortOption = 'reign_start' | 'name';

function formatYear(year: number | null): string {
  if (year === null) {
    return 'Unknown';
  }

  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatReign(start: number, end: number | null): string {
  return `${formatYear(start)} - ${formatYear(end)}`;
}

function matchesSearch(ruler: Ruler, query: string): boolean {
  if (!query) {
    return true;
  }

  const normalizedQuery = query.toLowerCase();
  return [ruler.name, ruler.native_name ?? ''].some((value) =>
    value.toLowerCase().includes(normalizedQuery)
  );
}

export function RulersEncyclopaedia({
  empire,
  rulers,
}: RulersEncyclopaediaProps) {
  const [search, setSearch] = useState('');
  const [selectedDynasty, setSelectedDynasty] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('reign_start');
  const [selectedRulerId, setSelectedRulerId] = useState<number | null>(
    rulers[0]?.id ?? null
  );

  const dynasties = useMemo(
    () =>
      Array.from(
        new Set(
          rulers
            .map((ruler) => ruler.dynasty)
            .filter((dynasty): dynasty is string => Boolean(dynasty))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [rulers]
  );

  const filteredRulers = useMemo(() => {
    const filtered = rulers.filter((ruler) => {
      const dynastyMatch =
        selectedDynasty === 'all' || ruler.dynasty === selectedDynasty;

      return dynastyMatch && matchesSearch(ruler, search);
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }

      return a.reign_start - b.reign_start;
    });
  }, [rulers, search, selectedDynasty, sortBy]);

  const selectedRuler =
    selectedRulerId === null
      ? null
      : (filteredRulers.find((ruler) => ruler.id === selectedRulerId) ?? null);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-8 border-l-4 pl-6"
          style={{ borderColor: empire.color }}
        >
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Rulers Encyclopaedia
          </p>
          <h1 className="text-4xl font-bold">{empire.name} Rulers</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Browse rulers by dynasty, search by name, and inspect each reign in
            a focused detail panel.
          </p>
        </header>

        <EmpireSectionNav empire={empire} />

        <section className="mb-6 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Search
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or native name"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none transition focus:border-zinc-500"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Dynasty
            </span>
            <select
              value={selectedDynasty}
              onChange={(event) => setSelectedDynasty(event.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none transition focus:border-zinc-500"
            >
              <option value="all">All dynasties</option>
              {dynasties.map((dynasty) => (
                <option key={dynasty} value={dynasty}>
                  {dynasty}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-300">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none transition focus:border-zinc-500"
            >
              <option value="reign_start">Reign start</option>
              <option value="name">Name</option>
            </select>
          </label>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              {filteredRulers.length}{' '}
              {filteredRulers.length === 1 ? 'ruler' : 'rulers'}
            </p>

            {rulers.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-zinc-400">
                No rulers are available yet for this empire.
              </div>
            ) : filteredRulers.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 text-zinc-400">
                No rulers match your filters.
              </div>
            ) : (
              filteredRulers.map((ruler) => {
                const isSelected = selectedRuler?.id === ruler.id;

                return (
                  <button
                    key={ruler.id}
                    type="button"
                    onClick={() => {
                      setSelectedRulerId(ruler.id);
                      track('ruler_viewed', {
                        empire: empire.slug,
                        ruler_name: ruler.name,
                        ruler_id: ruler.id,
                      });
                    }}
                    className="block w-full rounded-xl border border-zinc-800 bg-zinc-950/70 p-5 text-left transition hover:border-zinc-600"
                    style={
                      isSelected
                        ? {
                            borderColor: empire.color,
                            boxShadow: `inset 0 0 0 1px ${empire.color}`,
                          }
                        : undefined
                    }
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {ruler.name}
                        </h2>
                        {ruler.native_name ? (
                          <p className="mt-1 text-sm italic text-zinc-400">
                            {ruler.native_name}
                          </p>
                        ) : null}
                      </div>

                      <p className="text-sm font-medium text-zinc-300">
                        {formatReign(ruler.reign_start, ruler.reign_end)}
                      </p>
                    </div>

                    {ruler.dynasty ? (
                      <p className="mt-3 text-sm text-zinc-400">
                        {ruler.dynasty}
                      </p>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>

          {selectedRuler ? (
            <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 lg:sticky lg:top-6 lg:self-start">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Selected ruler
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                {selectedRuler.name}
              </h2>

              {selectedRuler.native_name ? (
                <p className="mt-2 text-base italic text-zinc-400">
                  {selectedRuler.native_name}
                </p>
              ) : null}

              <div className="mt-5 space-y-3 text-sm text-zinc-300">
                <p>
                  <span className="text-zinc-500">Dynasty:</span>{' '}
                  {selectedRuler.dynasty ?? 'Unknown'}
                </p>
                <p>
                  <span className="text-zinc-500">Reign:</span>{' '}
                  {formatReign(
                    selectedRuler.reign_start,
                    selectedRuler.reign_end
                  )}
                </p>
              </div>

              <p className="mt-6 leading-7 text-zinc-300">
                {selectedRuler.bio_short ?? 'No biography available.'}
              </p>
            </aside>
          ) : null}
        </section>
      </div>
    </main>
  );
}
