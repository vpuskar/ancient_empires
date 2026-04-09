'use client';

import type { QuizDifficultyLevel } from '@/lib/types/quiz';

interface DifficultySelectProps {
  difficulties: QuizDifficultyLevel[];
  empireColor: string;
  onSelect: (level: QuizDifficultyLevel) => void;
}

const ACCENT_OPACITY = [0.3, 0.5, 0.7, 1];

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatMultiplier(multiplier: number): string {
  return Number.isInteger(multiplier)
    ? multiplier.toFixed(0)
    : multiplier.toString();
}

export function DifficultySelect({
  difficulties,
  empireColor,
  onSelect,
}: DifficultySelectProps) {
  return (
    <div>
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <div
          className="font-display text-[10px] uppercase tracking-[0.5em]"
          style={{ color: empireColor }}
        >
          PROVE YOUR WORTH
        </div>
        <h2 className="mt-4 font-display text-[28px] text-[#F5E6C8]">
          Choose Your Rank
        </h2>
        <p className="mt-3 font-display text-[15px] italic text-[#9A8B70]">
          {'Higher rank, harder questions, less time \u2014 greater glory'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {difficulties.map((level, index) => (
          <button
            key={level.id}
            type="button"
            onClick={() => onSelect(level)}
            className="group overflow-hidden rounded-[14px] border text-left transition duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: 'rgba(184,134,11,0.12)',
              backgroundColor: 'rgba(26,18,16,0.6)',
            }}
          >
            <div
              className="h-[2px] w-full"
              style={{
                background: `linear-gradient(90deg, ${hexToRgba(
                  empireColor,
                  ACCENT_OPACITY[index] ?? 1
                )}, rgba(245, 230, 200, 0.9))`,
              }}
            />
            <div className="p-5">
              <div className="text-[36px] leading-none text-[#F5E6C8]">
                {level.icon || '\u2726'}
              </div>
              <div className="mt-4 font-display text-[18px] font-bold text-[#F5E6C8]">
                {level.name}
              </div>
              <div className="mt-1 font-display text-[12px] italic text-[#C9A86A]">
                {level.subtitle}
              </div>
              <p className="mt-4 min-h-[54px] font-display text-[13px] leading-5 text-[#9A8B70]">
                {level.description}
              </p>
            </div>
            <div
              className="grid grid-cols-2 gap-3 border-t px-5 py-4"
              style={{ borderTopColor: 'rgba(184,134,11,0.12)' }}
            >
              <div>
                <div className="font-display text-base text-[#F5E6C8]">
                  {level.timer}s
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#9A8B70]">
                  Timer
                </div>
              </div>
              <div>
                <div className="font-display text-base text-[#F5E6C8]">
                  {'\u00D7'}
                  {formatMultiplier(level.multiplier)}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#9A8B70]">
                  Points
                </div>
              </div>
            </div>
            <style jsx>{`
              button:hover {
                background: rgba(34, 24, 21, 0.82) !important;
                border-color: rgba(184, 134, 11, 0.42) !important;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.22);
              }
            `}</style>
          </button>
        ))}
      </div>
    </div>
  );
}
