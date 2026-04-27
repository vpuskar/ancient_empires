'use client';

import RulerVitals from '@/components/compare/RulerVitals';
import type { EmpireConfig } from '@/lib/empires/config';
import type { CompareAggregates } from '@/lib/types/compare';

interface EmpireCardProps {
  empire: EmpireConfig;
  currentYear: number;
  aggregates: CompareAggregates;
}

function getStatus(
  empire: EmpireConfig,
  currentYear: number
): { label: string; className: string } {
  if (currentYear < empire.startYear) {
    return {
      label: 'Not yet founded',
      className: 'bg-stone-100 text-stone-500',
    };
  }

  if (currentYear > empire.endYear) {
    return {
      label: 'Fallen',
      className: 'bg-stone-100 text-stone-500',
    };
  }

  return {
    label: 'Active',
    className: 'bg-emerald-100 text-emerald-700',
  };
}

function formatPeakArea(areaKm2: number): string {
  return `${(areaKm2 / 1_000_000).toFixed(1)}M km²`;
}

export default function EmpireCard({
  empire,
  currentYear,
  aggregates,
}: EmpireCardProps) {
  const status = getStatus(empire, currentYear);

  return (
    <article
      className="space-y-5 rounded border border-stone-200 bg-white p-4 shadow-sm"
      style={{ borderLeftColor: empire.color, borderLeftWidth: 4 }}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-xl text-stone-950">{empire.name}</h2>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-stone-500">
            Peak territory
          </p>
          <p className="text-lg font-semibold text-stone-900">
            {formatPeakArea(aggregates.peak_area_km2)}
          </p>
        </div>
      </div>

      <RulerVitals
        empireColor={empire.color}
        empireId={empire.id}
        year={currentYear}
      />
    </article>
  );
}
