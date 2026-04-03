'use client';

import { useMemo, useState } from 'react';
import type { TimelineMarker, TimelineSnapshot } from '@/lib/types/territorial';

interface TimelineScrubberProps {
  snapshots: TimelineSnapshot[];
  markers: TimelineMarker[];
  activeIdx: number;
  onSelect: (index: number) => void;
  onPlayToggle: () => void;
  isPlaying: boolean;
  empireColor: string;
}

interface MarkerTooltipState {
  title: string;
  left: number;
}

function formatTick(year: number) {
  if (year < 0) return `${Math.abs(year)}`;
  if (year === 0) return 'AD';
  return `${year}`;
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

export function TimelineScrubber({
  snapshots,
  markers,
  activeIdx,
  onSelect,
  onPlayToggle: _onPlayToggle,
  isPlaying: _isPlaying,
  empireColor,
}: TimelineScrubberProps) {
  const [tooltip, setTooltip] = useState<MarkerTooltipState | null>(null);
  void _onPlayToggle;
  void _isPlaying;

  const { minYear, maxYear, range, snapshotPositions, markerPositions, tickYears } =
    useMemo(() => {
      const allYears = [
        ...snapshots.map((snapshot) => snapshot.year),
        ...markers.map((marker) => marker.year),
      ];
      const min = Math.min(...allYears) - 50;
      const max = Math.max(...allYears) + 50;
      const computedRange = max - min;
      const toPosition = (year: number) => ((year - min) / computedRange) * 100;

      const startTick = Math.ceil(min / 100) * 100;
      const endTick = Math.floor(max / 100) * 100;
      const ticks: number[] = [];

      for (let year = startTick; year <= endTick; year += 100) {
        ticks.push(year);
      }

      return {
        minYear: min,
        maxYear: max,
        range: computedRange,
        snapshotPositions: snapshots.map((snapshot) => toPosition(snapshot.year)),
        markerPositions: markers.map((marker) => toPosition(marker.year)),
        tickYears: ticks,
      };
    }, [markers, snapshots]);

  const activePosition = snapshotPositions[activeIdx] ?? 0;

  return (
    <div className="relative w-full">
      <div className="relative h-6">
        {tooltip ? (
          <div
            className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-[4px] border border-[rgba(184,134,11,0.2)] bg-[rgba(10,8,5,0.92)] px-2 py-1 font-display text-[10px] tracking-[0.08em] text-[#F5E6C8]"
            style={{ left: `${tooltip.left}%` }}
          >
            {tooltip.title}
          </div>
        ) : null}

        {markers.map((marker, index) => (
          <button
            key={`${marker.year}-${marker.title}`}
            type="button"
            className="absolute top-2 h-2 w-2 -translate-x-1/2 rounded-[2px] border transition-colors duration-300"
            style={{
              left: `${markerPositions[index]}%`,
              backgroundColor: 'rgba(184,134,11,0.3)',
              borderColor: 'rgba(184,134,11,0.5)',
            }}
            onMouseEnter={() =>
              setTooltip({ title: marker.title, left: markerPositions[index] })
            }
            onMouseLeave={() => setTooltip(null)}
            onFocus={() =>
              setTooltip({ title: marker.title, left: markerPositions[index] })
            }
            onBlur={() => setTooltip(null)}
            aria-label={`${marker.label} ${marker.title}`}
          />
        ))}
      </div>

      <div className="relative h-7">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-[rgba(184,134,11,0.1)]" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${activePosition}%`,
            background: `linear-gradient(90deg, ${hexToRgba(empireColor, 0.3)} 0%, ${empireColor} 100%)`,
          }}
        />

        {snapshots.map((snapshot, index) => {
          const isActive = index === activeIdx;

          return (
            <button
              key={snapshot.year}
              type="button"
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'h-[14px] w-[14px] sm:h-[18px] sm:w-[18px]'
                  : 'h-[10px] w-[10px] sm:h-[12px] sm:w-[12px]'
              }`}
              style={{
                left: `${snapshotPositions[index]}%`,
                zIndex: isActive ? 2 : 1,
                background: isActive
                  ? `radial-gradient(circle at 35% 35%, #B8860B 0%, ${empireColor} 68%, ${hexToRgba(empireColor, 0.95)} 100%)`
                  : 'rgba(184,134,11,0.3)',
                border: isActive
                  ? '2px solid rgba(184,134,11,0.9)'
                  : '1.5px solid rgba(184,134,11,0.5)',
                boxShadow: isActive
                  ? '0 0 12px rgba(184,134,11,0.5)'
                  : 'none',
              }}
              onClick={() => onSelect(index)}
              aria-label={`Select year ${snapshot.label}`}
            />
          );
        })}
      </div>

      <div className="relative mt-2 h-6">
        {tickYears.map((year) => (
          <div
            key={year}
            className="absolute -translate-x-1/2 font-body text-[11px] text-[#6B5B47]"
            style={{ left: `${((year - minYear) / range) * 100}%` }}
          >
            {formatTick(year)}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
        {markers.map((marker) => {
          const isHighlighted =
            Math.abs(marker.year - snapshots[activeIdx].year) <= 80;

          return (
            <div
              key={`pill-${marker.year}-${marker.title}`}
              className="rounded-[4px] border px-2 py-[3px] font-display text-[9px] uppercase tracking-[0.1em] transition-all duration-300"
              style={{
                color: isHighlighted ? '#F5E6C8' : '#6B5B47',
                backgroundColor: isHighlighted
                  ? hexToRgba(empireColor, 0.3)
                  : 'transparent',
                borderColor: isHighlighted
                  ? hexToRgba(empireColor, 0.18)
                  : 'transparent',
              }}
            >
              {marker.title}
            </div>
          );
        })}
      </div>

      <div className="sr-only">
        Timeline range {minYear} to {maxYear}. Active snapshot{' '}
        {snapshots[activeIdx].label}.
      </div>
    </div>
  );
}
