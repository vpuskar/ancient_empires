'use client';

import { useEffect, useState } from 'react';
import type { RulerProfile } from '@/lib/types/personality';

interface MatchScoresProps {
  scores: { ruler: RulerProfile; matchPercent: number }[];
  empireColor: string;
}

export function MatchScores({ scores, empireColor }: MatchScoresProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="w-full rounded-[18px] border px-4 py-5"
      style={{ borderColor: `${empireColor}14` }}
    >
      <div className="text-center font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
        Match Scores
      </div>

      <div className="mt-5 space-y-3">
        {scores.map((score, index) => {
          const isTopScore = index === 0;

          return (
            <div key={score.ruler.id} className="flex items-center gap-3">
              <div
                className="w-[110px] text-right font-display text-[12px]"
                style={{ color: isTopScore ? '#F5E6C8' : '#6B5B47' }}
              >
                {score.ruler.name}
              </div>

              <div className="flex-1">
                <div className="h-[6px] overflow-hidden rounded-full bg-[rgba(184,134,11,0.08)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: mounted ? `${score.matchPercent}%` : '0%',
                      background: isTopScore
                        ? `linear-gradient(90deg, ${score.ruler.color}, #B8860B)`
                        : 'rgba(184,134,11,0.2)',
                      transition: 'width 1s ease 0.3s',
                    }}
                  />
                </div>
              </div>

              <div
                className="w-9 text-right font-body text-[12px]"
                style={{ color: isTopScore ? '#B8860B' : '#6B5B47' }}
              >
                {score.matchPercent}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
