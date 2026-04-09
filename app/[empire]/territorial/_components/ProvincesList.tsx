'use client';

import { useEffect, useMemo, useState } from 'react';

interface ProvincesListProps {
  provinces: string[];
  empireColor: string;
  maxVisible?: number;
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

export function ProvincesList({
  provinces,
  empireColor,
  maxVisible = 8,
}: ProvincesListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 0);
    const showTimer = window.setTimeout(() => setVisible(true), 150);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
    };
  }, [provinces]);

  const visibleProvinces = useMemo(
    () => (isExpanded ? provinces : provinces.slice(0, maxVisible)),
    [isExpanded, maxVisible, provinces]
  );

  const canExpand = provinces.length > maxVisible;

  return (
    <div className="space-y-3">
      <div
        className={`space-y-[6px] transition-opacity duration-300 ${
          isExpanded ? 'max-h-[300px] overflow-y-auto pr-1' : ''
        }`}
        style={{ opacity: visible ? 1 : 0 }}
      >
        {visibleProvinces.map((province) => (
          <div key={province} className="flex items-start gap-2">
            <span
              className="mt-[7px] h-[7px] w-[7px] shrink-0 rounded-[2px]"
              style={{
                backgroundColor: empireColor,
                boxShadow: `0 0 8px ${hexToRgba(empireColor, 0.4)}`,
              }}
            />
            <span className="min-w-0 break-words font-body text-[14px] leading-snug text-[#F5E6C8]">
              {province}
            </span>
          </div>
        ))}
      </div>

      {canExpand ? (
        <button
          type="button"
          className="font-body text-[12px] underline-offset-2 hover:underline"
          style={{ color: empireColor }}
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Show less' : `Show all ${provinces.length}`}
        </button>
      ) : null}
    </div>
  );
}
