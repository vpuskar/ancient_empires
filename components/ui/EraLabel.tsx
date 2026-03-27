'use client';

/**
 * EraLabel
 *
 * Displays a pill badge with the historical era for a given year.
 * Used in rulers detail panel, story chapters, and timeline events.
 *
 * Usage:
 *   <EraLabel year={-27} />       → "Principate"
 *   <EraLabel year={312} />       → "Dominate"
 *   <EraLabel year={-216} empire="roman" />
 */

interface Era {
  name: string;
  color: string;
}

/**
 * Roman Empire eras. Add similar maps for other empires as needed.
 */
const ROMAN_ERAS: {
  start: number;
  end: number;
  name: string;
  color: string;
}[] = [
  { start: -753, end: -509, name: 'Roman Kingdom', color: '#6B6560' },
  { start: -509, end: -27, name: 'Roman Republic', color: '#C9A84C' },
  { start: -27, end: 96, name: 'Early Empire', color: '#8B0000' },
  { start: 96, end: 192, name: 'Pax Romana', color: '#5DCAA5' },
  {
    start: 192,
    end: 284,
    name: 'Crisis of the Third Century',
    color: '#E24B4A',
  },
  { start: 284, end: 395, name: 'Dominate', color: '#AFA9EC' },
  { start: 395, end: 476, name: 'Fall of the West', color: '#6B6560' },
];

function getEra(year: number, empire = 'roman'): Era {
  // Currently only Roman eras implemented.
  // Add Chinese dynasties, Japanese periods, Ottoman centuries as needed.
  if (empire !== 'roman') {
    return { name: 'Unknown era', color: '#6B6560' };
  }

  const era = ROMAN_ERAS.find((e) => year >= e.start && year < e.end);
  return era
    ? { name: era.name, color: era.color }
    : { name: 'Unknown era', color: '#6B6560' };
}

interface EraLabelProps {
  year: number;
  empire?: string;
  className?: string;
}

export function EraLabel({
  year,
  empire = 'roman',
  className = '',
}: EraLabelProps) {
  const era = getEra(year, empire);

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${className}`}
      style={{
        backgroundColor: `${era.color}15`,
        border: `1px solid ${era.color}30`,
        color: era.color,
      }}
    >
      {era.name}
    </span>
  );
}

/** Export the raw function for non-component use (e.g. data processing) */
export { getEra };
