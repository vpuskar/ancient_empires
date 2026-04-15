'use client';

import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';
import { TimelineContainer } from './TimelineContainer';

interface LegacyTimelinePageProps {
  empire: EmpireConfig;
  events: TimelineEvent[];
}

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

export default function LegacyTimelinePage({
  empire,
  events,
}: LegacyTimelinePageProps) {
  return (
    <main className="min-h-screen bg-[#0C0B09] px-4 py-12 text-[#F0ECE2] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-8 border-l-4 pl-6 py-2"
          style={{ borderColor: empire.color }}
        >
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#8B7355]">
            Interactive Timeline
          </p>
          <h1 className="text-4xl font-bold">{empire.name} Timeline</h1>
          <p className="mt-3 max-w-2xl text-[#B9AA8E]">
            Explore key events from {formatYear(empire.startYear)} to{' '}
            {formatYear(empire.endYear)}. Filter by category and inspect major
            turning points across the history of the {empire.name}.
          </p>
        </header>

        <EmpireSectionNav empire={empire} />

        <TimelineContainer empire={empire} events={events} />
      </div>
    </main>
  );
}
