'use client';

import { useEffect, useState } from 'react';
import type { TimelineSnapshot } from '@/lib/types/territorial';
import { ProvincesList } from './ProvincesList';
import { TerritoryBar } from './TerritoryBar';

interface ContextPanelProps {
  snapshot: TimelineSnapshot;
  maxAreaKm2: number;
  empireColor: string;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const parsed = Number.parseInt(value, 16);

  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${alpha})`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-[10px] tracking-[0.3em] uppercase text-[#9A8B70]">
      {children}
    </p>
  );
}

export function ContextPanel({
  snapshot,
  maxAreaKm2,
  empireColor,
}: ContextPanelProps) {
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 0);
    const showTimer = window.setTimeout(() => setVisible(true), 150);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
    };
  }, [snapshot]);

  return (
    <aside className="w-full md:w-[240px] md:shrink-0">
      <div className="rounded-[20px] border border-[rgba(184,134,11,0.08)] bg-[rgba(10,7,5,0.24)] px-4 py-4 md:border-none md:bg-transparent md:px-0 md:py-0">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 md:pointer-events-none md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
        >
          <div className="min-w-0 text-left">
            <p className="font-display text-[13px] tracking-[0.18em] uppercase text-[#F5E6C8]">
              {snapshot.era}
            </p>
            <p className="mt-1 font-display text-[20px] text-[#B8860B]">
              {(snapshot.areaKm2 / 1_000_000).toFixed(1)}M
            </p>
          </div>
          <span
            className={`h-0 w-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#9A8B70] transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-500 md:max-h-none md:overflow-visible ${
            isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 md:opacity-100'
          }`}
        >
          <div
            className="space-y-6 pt-4 transition-opacity duration-300 md:pt-0"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <section className="space-y-3">
              <SectionLabel>Current Era</SectionLabel>
              <div
                className="rounded-r-[8px] border-l-[3px] px-4 py-3"
                style={{
                  borderLeftColor: empireColor,
                  backgroundColor: hexToRgba(empireColor, 0.04),
                }}
              >
                <p className="font-display text-[15px] font-bold text-[#F5E6C8]">
                  {snapshot.era}
                </p>
                <p className="mt-2 font-body text-[13px] leading-[1.5] text-[#9A8B70]">
                  {snapshot.eraDesc}
                </p>
                <p className="mt-2 font-body text-[12px] text-[#6B5B47]">
                  {snapshot.eraRange}
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <SectionLabel>Territory</SectionLabel>
              <TerritoryBar
                areaKm2={snapshot.areaKm2}
                maxAreaKm2={maxAreaKm2}
                empireColor={empireColor}
              />
            </section>

            <section className="space-y-3">
              <SectionLabel>{`Territories (${snapshot.provinces.length})`}</SectionLabel>
              <ProvincesList
                provinces={snapshot.provinces}
                empireColor={empireColor}
              />
            </section>
          </div>
        </div>
      </div>
    </aside>
  );
}
