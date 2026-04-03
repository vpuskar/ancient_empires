'use client';

import type { TimelineSnapshot } from '@/lib/types/territorial';

interface TimelineHeaderProps {
  empireName: string;
  empireNativeName: string;
  empireColor: string;
  activeSnapshot: TimelineSnapshot;
}

function formatArea(areaKm2: number): string {
  return `${(areaKm2 / 1_000_000).toFixed(2)}M km2`;
}

export function TimelineHeader({
  empireName,
  empireNativeName,
  empireColor,
  activeSnapshot,
}: TimelineHeaderProps) {
  return (
    <header className="border-b border-[rgba(184,134,11,0.08)] px-6 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-5">
          <div
            className="mt-1 h-16 w-[3px] rounded-full"
            style={{ backgroundColor: empireColor }}
          />
          <div className="space-y-3">
            <p
              className="font-display text-[10px] tracking-[0.5em] uppercase transition-colors duration-500"
              style={{ color: empireColor }}
            >
              {empireNativeName}
            </p>
            <div>
              <h1 className="font-display text-[30px] leading-none text-[#F5E6C8] sm:text-[32px]">
                Territorial Timeline
              </h1>
              <p className="mt-3 text-sm text-[#9A8B70]">
                A measured view of {empireName} at its turning points.
              </p>
            </div>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="font-display text-[40px] leading-none text-[#F5E6C8] transition-all duration-500">
            {activeSnapshot.label}
          </div>
          <p className="mt-3 font-body text-[13px] text-[#9A8B70] transition-all duration-500">
            {formatArea(activeSnapshot.areaKm2)} / {activeSnapshot.provinces.length}{' '}
            territories
          </p>
        </div>
      </div>
    </header>
  );
}
