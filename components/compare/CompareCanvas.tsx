'use client';

import Link from 'next/link';
import { useState } from 'react';

import EmpireCard from '@/components/compare/EmpireCard';
import LegacyRadar from '@/components/compare/LegacyRadar';
import StatWidgets from '@/components/compare/StatWidgets';
import TimelineScrubber from '@/components/compare/TimelineScrubber';
import VisualPulse from '@/components/compare/VisualPulse';
import { SCRUBBER_DEFAULT } from '@/lib/config/compare/scrubber';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';
import type { CompareData } from '@/lib/types/compare';

interface CompareCanvasProps {
  data: CompareData;
}

const quizLinkColor = EMPIRE_CONFIGS.find((empire) => empire.id === 4)?.color;

export default function CompareCanvas({ data }: CompareCanvasProps) {
  const [currentYear, setCurrentYear] = useState(SCRUBBER_DEFAULT);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="space-y-8">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Ancient Empires — Compare
          </p>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl">
              Four empires. One global canvas.
            </h1>
            <p className="text-base text-stone-600 sm:text-lg">
              Synchronized history, 500 BC to 1945 AD.
            </p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {EMPIRE_CONFIGS.map((empire) => (
            <span
              key={empire.id}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-sm font-medium text-stone-800"
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: empire.color }}
              />
              {empire.name}
            </span>
          ))}
        </div>

        <VisualPulse extents={data.extents} currentYear={currentYear} />
        <TimelineScrubber year={currentYear} onChange={setCurrentYear} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {EMPIRE_CONFIGS.map((empire) => {
            const aggregates = data.aggregates.find(
              (entry) => entry.empire_id === empire.id
            );

            if (!aggregates) {
              return null;
            }

            return (
              <EmpireCard
                key={empire.id}
                aggregates={aggregates}
                currentYear={currentYear}
                empire={empire}
              />
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StatWidgets aggregates={data.aggregates} />
          <LegacyRadar />
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-2">
            {EMPIRE_CONFIGS.map((empire) => (
              <span
                key={empire.id}
                aria-hidden="true"
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: empire.color }}
              />
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <h2 className="text-2xl font-semibold tracking-normal text-stone-950">
              Which empire claims you?
            </h2>
            <p className="text-sm text-stone-600">
              A reflective 10-question personality quiz across Rome, China,
              Japan, and the Ottoman world.
            </p>
          </div>

          <Link
            href="/compare/personality"
            className="mt-5 inline-flex text-sm font-medium"
            style={{ color: quizLinkColor }}
          >
            Take the quiz →
          </Link>
        </div>
      </div>
    </main>
  );
}
