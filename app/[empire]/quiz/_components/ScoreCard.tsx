'use client';

import { motion } from 'framer-motion';
import { calculateRank } from '@/lib/config/quiz-ranks';
import type { QuizDifficultyLevel } from '@/lib/types/quiz';

interface ScoreCardProps {
  rawScore: number;
  weightedScore: number;
  totalQuestions: number;
  totalTimeSpent: number;
  difficulty: QuizDifficultyLevel;
  empireColor: string;
  onPlayAgain: () => void;
  onChangeCategory: () => void;
  onChangeRank: () => void;
}

function formatScore(score: number): string {
  return score % 1 === 0 ? score.toString() : score.toFixed(1);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ScoreCard({
  rawScore,
  weightedScore,
  totalQuestions,
  totalTimeSpent,
  difficulty,
  empireColor,
  onPlayAgain,
  onChangeCategory,
  onChangeRank,
}: ScoreCardProps) {
  const rank = calculateRank(rawScore, totalQuestions, difficulty.name);
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - rank.percent / 100);

  const stats = [
    { label: 'Points', value: formatScore(weightedScore), color: '#B8860B' },
    { label: 'Correct', value: rawScore.toString(), color: '#4A6741' },
    {
      label: 'Wrong',
      value: Math.max(totalQuestions - rawScore, 0).toString(),
      color: empireColor,
    },
    { label: 'Time', value: formatTime(totalTimeSpent), color: '#9A8B70' },
  ];

  return (
    <div className="mx-auto max-w-[460px] text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
        style={{
          backgroundColor: 'rgba(184,134,11,0.08)',
          borderColor: 'rgba(184,134,11,0.15)',
        }}
      >
        <span className="font-display text-[11px] uppercase tracking-[0.18em] text-[#B8860B]">
          {difficulty.icon ? `${difficulty.icon} ` : ''}
          {difficulty.name} {'\u00D7'}
          {difficulty.multiplier} Points
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="mt-8"
      >
        <div
          className="font-display text-[10px] uppercase tracking-[0.5em]"
          style={{ color: empireColor }}
        >
          YOUR RANK
        </div>
        <h2
          className="mt-4 font-display text-[34px] font-bold"
          style={{ color: rank.color }}
        >
          {rank.name}
        </h2>
        <p className="mt-3 font-display text-[14px] italic text-[#9A8B70]">
          {rank.displayDesc}
        </p>
      </motion.div>

      <div className="mt-8 flex justify-center">
        <svg width="170" height="170" viewBox="0 0 170 170">
          <circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke="rgba(184,134,11,0.08)"
            strokeWidth="7"
          />
          <motion.circle
            cx="85"
            cy="85"
            r={radius}
            fill="none"
            stroke={rank.color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
            style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
          />
          <text
            x="85"
            y="77"
            textAnchor="middle"
            className="font-display text-[38px] font-bold"
            fill={rank.color}
          >
            {rank.percent}%
          </text>
          <text
            x="85"
            y="102"
            textAnchor="middle"
            className="font-display text-[12px]"
            fill="#9A8B70"
          >
            {rawScore} / {totalQuestions} correct
          </text>
        </svg>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8 + index * 0.1,
              ease: 'easeOut',
            }}
            className="min-w-[88px]"
          >
            <div
              className="font-display text-[20px] font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#6B5B47]">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-8 h-px w-[100px] bg-[linear-gradient(90deg,transparent,rgba(184,134,11,0.3),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full rounded-[8px] px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.16em] text-[#F5E6C8] sm:w-auto"
          style={{
            background: `linear-gradient(135deg, ${empireColor}, rgba(184,134,11,0.95))`,
          }}
        >
          Play Again
        </button>
        <button
          type="button"
          onClick={onChangeCategory}
          className="w-full rounded-[8px] border px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.16em] text-[#F5E6C8] sm:w-auto"
          style={{ borderColor: 'rgba(184,134,11,0.16)' }}
        >
          Change Arena
        </button>
        <button
          type="button"
          onClick={onChangeRank}
          className="w-full rounded-[8px] border px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.16em] text-[#F5E6C8] sm:w-auto"
          style={{ borderColor: 'rgba(184,134,11,0.16)' }}
        >
          Change Rank
        </button>
      </motion.div>
    </div>
  );
}
