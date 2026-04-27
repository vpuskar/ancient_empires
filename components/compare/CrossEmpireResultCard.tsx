'use client';

import Link from 'next/link';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';
import type {
  CrossPersonalityResult,
  EmpireId,
} from '@/lib/types/crossPersonality';

interface CrossEmpireResultCardProps {
  result: CrossPersonalityResult;
  onRetake: () => void;
}

const TAGLINES: Record<EmpireId, string> = {
  1: 'You build to last. Rome would have made you senator.',
  2: 'You think in centuries. The Middle Kingdom calls.',
  3: 'Honour before ambition. Japan recognises you.',
  4: 'You bridge worlds. The Sublime Porte opens its gates.',
};

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

function getEmpire(empireId: number) {
  const empire = EMPIRE_CONFIGS.find((config) => config.id === empireId);

  if (!empire) {
    throw new Error(`Unknown empire id: ${empireId}`);
  }

  return empire;
}

export function CrossEmpireResultCard({
  result,
  onRetake,
}: CrossEmpireResultCardProps) {
  const winningEmpire = getEmpire(result.winningEmpireId);
  const runnerUpEmpire = getEmpire(result.runnerUpEmpireId);
  const winningScore = result.empireScores[0];
  const initials = result.rulerResult.ruler.name.charAt(0);

  return (
    <div className="mx-auto max-w-[760px]" aria-label="Cross-empire result">
      <section className="text-center">
        <div
          className="font-display text-[10px] uppercase tracking-[0.5em]"
          style={{ color: winningEmpire.color }}
        >
          Your result
        </div>
        <p className="mt-5 font-body text-[14px] text-[#9A8B70]">
          The empire that claims you is
        </p>
        <h2
          className="mt-2 font-display text-[40px] leading-[1.1] font-bold sm:text-[52px]"
          style={{ color: winningEmpire.color }}
        >
          {winningEmpire.name}
        </h2>
        <p className="mt-3 font-body text-[14px] italic text-[#6B5B47]">
          {runnerUpEmpire.name} almost claimed you.
        </p>
        <p className="mx-auto mt-5 max-w-[460px] font-body text-[16px] italic leading-[1.6] text-[#C4B69A]">
          {TAGLINES[result.winningEmpireId]}
        </p>
      </section>

      <section
        className="relative mt-9 rounded-[18px] border px-5 py-5 sm:px-6"
        style={{
          borderColor: `${winningEmpire.color}2e`,
          borderLeft: `4px solid ${winningEmpire.color}`,
          backgroundColor: 'rgba(26,18,16,0.55)',
        }}
      >
        <div className="absolute top-5 right-5 text-right">
          <div
            className="font-display text-[22px] leading-none"
            style={{ color: winningEmpire.color }}
          >
            {winningScore.matchPercent}%
          </div>
          <div className="mt-1 font-display text-[9px] uppercase tracking-[0.2em] text-[#6B5B47]">
            empire match
          </div>
        </div>

        <div className="flex gap-4 pr-20">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-[24px]"
            style={{
              backgroundColor: hexToRgba(winningEmpire.color, 0.2),
              color: winningEmpire.color,
            }}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div>
            <h3 className="font-body text-[20px] font-medium text-[#F5E6C8]">
              {result.rulerResult.ruler.name}
            </h3>
            <p className="mt-1 font-body text-[14px] text-[#9A8B70]">
              {result.rulerResult.ruler.title} -{' '}
              {result.rulerResult.ruler.years}
            </p>
            <div
              className="mt-3 inline-flex rounded-[4px] px-3 py-1 font-display text-[10px] uppercase tracking-[0.18em]"
              style={{
                backgroundColor: hexToRgba(winningEmpire.color, 0.12),
                color: winningEmpire.color,
              }}
            >
              {result.rulerResult.ruler.title}
            </div>
          </div>
        </div>

        <p className="mt-5 font-body text-[14px] leading-[1.6] text-[#C4B69A]">
          {result.rulerResult.ruler.description}
        </p>
      </section>

      <section className="mt-8 rounded-[18px] border border-[rgba(184,134,11,0.1)] px-5 py-5">
        <div className="font-body text-[13px] italic text-[#B8860B]">
          How your match was calculated
        </div>
        <p className="mt-3 font-body text-[14px] leading-[1.7] text-[#9A8B70]">
          Your answers were first matched against the governing temperament of
          all four empires. Once your empire was identified, your personal
          profile was matched against every recorded ruler in that tradition to
          find your closest historical counterpart.
        </p>
      </section>

      <section className="mt-8">
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
          How the empires scored
        </div>

        <div className="mt-5 space-y-4">
          {result.empireScores.map((score, index) => {
            const empire = getEmpire(score.empireId);

            return (
              <div key={score.empireId} className="flex items-center gap-3">
                <div className="w-20 text-right font-display text-[12px] text-[#C4B69A]">
                  {empire.name.replace(' Empire', '')}
                </div>

                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-[rgba(184,134,11,0.08)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${score.matchPercent}%`,
                        backgroundColor: empire.color,
                      }}
                    />
                  </div>
                  {index === 0 ? (
                    <div
                      className="mt-1 font-body text-[12px]"
                      style={{ color: empire.color }}
                    >
                      Your empire
                    </div>
                  ) : null}
                  {index === 1 ? (
                    <div className="mt-1 font-body text-[12px] italic text-[#6B5B47]">
                      Almost
                    </div>
                  ) : null}
                </div>

                <div className="w-10 text-right font-body text-[12px] text-[#6B5B47]">
                  {score.matchPercent}%
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRetake}
          className="rounded-[8px] border px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.2em] text-[#F5E6C8] transition-colors hover:border-[#B8860B] focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120C08] focus-visible:outline-none"
          style={{ borderColor: 'rgba(184,134,11,0.16)' }}
        >
          Retake quiz
        </button>
        <Link
          href={`/${winningEmpire.slug}`}
          className="rounded-[8px] px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.2em] text-[#F5E6C8] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120C08] focus-visible:outline-none"
          style={{
            background: `linear-gradient(135deg, ${winningEmpire.color}, rgba(184,134,11,0.95))`,
            boxShadow: `0 14px 30px ${hexToRgba(winningEmpire.color, 0.2)}`,
          }}
        >
          Explore {winningEmpire.name}
        </Link>
        <Link
          href={`/${winningEmpire.slug}/personality`}
          className="rounded-[8px] border px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.2em] text-[#F5E6C8] transition-colors hover:border-[#B8860B] focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120C08] focus-visible:outline-none"
          style={{ borderColor: 'rgba(184,134,11,0.16)' }}
        >
          Full personality quiz
        </Link>
      </section>
    </div>
  );
}
