'use client';

import { motion } from 'framer-motion';
import type { PersonalityResult } from '@/lib/types/personality';
import { MatchScores } from './MatchScores';
import { ShareButton } from './ShareButton';

interface ResultScreenProps {
  result: PersonalityResult;
  empireColor: string;
  empireName: string;
  empireSlug: string;
  onRestart: () => void;
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

export function ResultScreen({
  result,
  empireColor,
  empireName,
  empireSlug,
  onRestart,
}: ResultScreenProps) {
  const displayNameColor =
    result.ruler.id === 'caligula' ? '#9A8B70' : result.ruler.color;

  return (
    <div
      className="mx-auto max-w-[520px] text-center"
      aria-label={`${empireName} personality result`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="font-display text-[10px] uppercase tracking-[0.5em]"
        style={{ color: empireColor }}
      >
        Your Inner Ruler
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.15 }}
        className="mx-auto mt-7 flex h-[120px] w-[120px] items-center justify-center rounded-full border"
        style={{
          borderColor: `${result.ruler.color}66`,
          background: `radial-gradient(circle at 50% 35%, ${hexToRgba(
            result.ruler.color,
            0.28
          )} 0%, ${hexToRgba(result.ruler.color, 0.12)} 52%, rgba(12, 8, 6, 0.1) 100%)`,
          boxShadow: `0 0 56px ${hexToRgba(result.ruler.color, 0.18)}`,
        }}
      >
        <div className="text-[56px] leading-none" aria-hidden="true">
          {result.ruler.portrait || '●'}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.3 }}
        className="mt-7"
      >
        <h2
          className="font-display text-[36px] font-bold"
          style={{ color: displayNameColor }}
        >
          {result.ruler.name}
        </h2>
        <div className="mt-2 font-body text-[15px] italic text-[#B8860B]">
          {result.ruler.title}
        </div>
        <div className="mt-1 font-body text-[12px] text-[#6B5B47]">
          {result.ruler.years}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.5 }}
        className="mx-auto mt-6 max-w-[400px] font-body text-[16px] leading-[1.7] text-[#C4B69A]"
      >
        {result.ruler.description}
      </motion.p>

      <div className="mt-7 flex flex-wrap justify-center gap-[10px]">
        {result.ruler.traits.map((trait, index) => (
          <motion.div
            key={trait}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: 'easeOut',
              delay: 0.65 + index * 0.05,
            }}
            className="rounded-[4px] border px-[14px] py-[5px] font-display text-[10px] uppercase tracking-[0.2em] text-[#B8860B]"
            style={{
              backgroundColor: 'rgba(184,134,11,0.08)',
              borderColor: 'rgba(184,134,11,0.15)',
            }}
          >
            {trait}
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-8 h-px w-[100px] bg-[linear-gradient(90deg,transparent,rgba(184,134,11,0.3),transparent)]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 0.85 }}
        className="mt-8"
      >
        <MatchScores scores={result.allScores} empireColor={empireColor} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut', delay: 1 }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <ShareButton
          rulerName={result.ruler.name}
          rulerTitle={result.ruler.title}
          empireSlug={empireSlug}
          empireColor={empireColor}
        />
        <button
          type="button"
          onClick={onRestart}
          className="rounded-[8px] border px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.2em] text-[#F5E6C8]"
          style={{ borderColor: 'rgba(184,134,11,0.16)' }}
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
