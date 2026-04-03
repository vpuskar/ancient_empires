'use client';

interface TerritoryBarProps {
  areaKm2: number;
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

export function TerritoryBar({
  areaKm2,
  maxAreaKm2,
  empireColor,
}: TerritoryBarProps) {
  const areaInMillions = areaKm2 / 1_000_000;
  const maxInMillions = maxAreaKm2 / 1_000_000;
  const progress = maxAreaKm2 > 0 ? (areaKm2 / maxAreaKm2) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="font-display text-[32px] font-bold leading-none text-[#B8860B]">
          {areaInMillions.toFixed(1)}M
        </div>
        <div className="font-body text-[12px] text-[#6B5B47]">km2</div>
      </div>

      <div
        className="relative h-[6px] overflow-hidden rounded-full"
        style={{ backgroundColor: hexToRgba(empireColor, 0.12) }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-800 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${empireColor}, #B8860B)`,
            boxShadow: `0 0 12px ${hexToRgba(empireColor, 0.2)}`,
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 font-body text-[10px] text-[#6B5B47]">
        <span>0</span>
        <span>{maxInMillions.toFixed(1)}M km2 peak</span>
      </div>
    </div>
  );
}
