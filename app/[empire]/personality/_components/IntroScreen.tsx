'use client';

import type { RulerProfile } from '@/lib/types/personality';

interface IntroScreenProps {
  rulers: RulerProfile[];
  empireColor: string;
  displayName: string;
  onStart: () => void;
}

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

export function IntroScreen({
  rulers,
  empireColor,
  displayName,
  onStart,
}: IntroScreenProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-8">
      <div className="mx-auto flex w-full max-w-[460px] flex-col items-center text-center">
        <div
          className="intro-icon flex h-20 w-20 items-center justify-center rounded-full border"
          style={{
            borderColor: hexToRgba(empireColor, 0.24),
            background: `radial-gradient(circle at 50% 40%, ${hexToRgba(
              empireColor,
              0.28
            )} 0%, ${hexToRgba(empireColor, 0.12)} 42%, rgba(12, 8, 6, 0.1) 100%)`,
            boxShadow: `0 0 50px ${hexToRgba(empireColor, 0.2)}`,
          }}
        >
          <div className="text-[40px] leading-none" aria-hidden="true">
            👑
          </div>
        </div>

        <div className="mt-8">
          <div
            className="font-display text-[10px] uppercase tracking-[0.6em]"
            style={{ color: empireColor }}
          >
            Personality Quiz
          </div>
          <h1 className="mt-4 font-display text-[30px] leading-[1.2] text-[#F5E6C8]">
            Which {displayName} Ruler Are You?
          </h1>
          <p className="mx-auto mt-4 max-w-[380px] font-body text-[16px] italic leading-[1.6] text-[#9A8B70]">
            Answer 8 questions and reveal how you would rule the empire.
          </p>
        </div>

        <div className="mt-9 flex flex-wrap justify-center gap-[14px]">
          {rulers.map((ruler) => (
            <div key={ruler.id} className="flex w-[64px] flex-col items-center">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border text-lg"
                style={{
                  borderColor: hexToRgba(ruler.color, 0.2),
                  backgroundColor: hexToRgba(ruler.color, 0.16),
                  color: ruler.color,
                }}
                aria-hidden="true"
              >
                {ruler.portrait || '●'}
              </div>
              <div className="mt-2 font-display text-[9px] uppercase tracking-[0.14em] text-[#6B5B47]">
                {ruler.name}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-10 rounded-[8px] px-12 py-[14px] font-display text-[14px] uppercase tracking-[0.3em] text-[#F5E6C8] transition-transform duration-200 hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${empireColor}, rgba(184, 134, 11, 0.95))`,
            boxShadow: `0 16px 36px ${hexToRgba(empireColor, 0.22)}`,
          }}
        >
          Reveal Your Ruler
        </button>

        <p className="mt-5 font-body text-[12px] text-[#4A3F34]">
          Takes about 2 minutes · No account needed
        </p>
      </div>
    </div>
  );
}
