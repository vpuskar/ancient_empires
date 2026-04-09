'use client';

import { useState } from 'react';
import type { QuizCategory, QuizDifficultyLevel } from '@/lib/types/quiz';

interface CategorySelectProps {
  categories: QuizCategory[];
  difficulty: QuizDifficultyLevel;
  empireColor: string;
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  onStart: (category: string) => void;
  onBack: () => void;
  error: string | null;
}

const QUESTION_COUNTS = [5, 10, 15, 20];

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

export function CategorySelect({
  categories,
  difficulty,
  empireColor,
  questionCount,
  onQuestionCountChange,
  onStart,
  onBack,
  error,
}: CategorySelectProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  const visibleError = error && dismissedError !== error ? error : null;
  const totalCount = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-fit text-sm text-[#C9A86A] transition hover:text-[#F5E6C8]"
        >
          &larr; Back
        </button>

        <div
          className="w-fit rounded-full border px-4 py-2"
          style={{
            borderColor: hexToRgba(empireColor, 0.24),
            backgroundColor: hexToRgba(empireColor, 0.1),
          }}
        >
          <div className="font-display text-sm text-[#F5E6C8]">
            {difficulty.icon ? `${difficulty.icon} ` : ''}
            {difficulty.name}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-[#9A8B70]">
            {difficulty.timer}s timer {'\u00B7'} {'\u00D7'}
            {difficulty.multiplier} points
          </div>
        </div>
      </div>

      {visibleError ? (
        <div
          className="mb-6 flex items-start justify-between gap-4 border-l-[3px] px-4 py-3"
          style={{
            borderLeftColor: empireColor,
            backgroundColor: hexToRgba(empireColor, 0.1),
          }}
        >
          <p className="font-display text-[13px] text-[#F3D7CF]">{visibleError}</p>
          <button
            type="button"
            onClick={() => setDismissedError(error)}
            className="text-xs uppercase tracking-[0.24em] text-[#F5E6C8]"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mb-8 text-center">
        <h2 className="font-display text-[24px] text-[#F5E6C8]">
          Choose Your Arena
        </h2>
        <p className="mt-3 font-display text-[15px] italic text-[#9A8B70]">
          Select a domain of mastery, then decide how long the trial should last
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-[16px] border p-5 text-left transition duration-200 hover:-translate-y-0.5"
              style={{
                borderColor: isSelected
                  ? empireColor
                  : 'rgba(184,134,11,0.12)',
                backgroundColor: isSelected
                  ? hexToRgba(empireColor, 0.14)
                  : 'rgba(26,18,16,0.6)',
              }}
            >
              <div className="text-[28px] leading-none text-[#F5E6C8]">
                {category.icon || '\u2726'}
              </div>
              <div className="mt-4 font-display text-[20px] text-[#F5E6C8]">
                {category.name}
              </div>
              <p className="mt-2 min-h-[44px] font-display text-[13px] leading-5 text-[#9A8B70]">
                {category.description}
              </p>
              <div className="mt-5 text-sm uppercase tracking-[0.24em] text-[#C9A86A]">
                {category.count} Questions
              </div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className="rounded-[16px] border p-5 text-left transition duration-200 hover:-translate-y-0.5"
          style={{
            borderColor:
              selectedCategory === 'all' ? empireColor : 'rgba(184,134,11,0.12)',
            backgroundColor:
              selectedCategory === 'all'
                ? hexToRgba(empireColor, 0.14)
                : 'rgba(26,18,16,0.6)',
          }}
        >
          <div className="text-[28px] leading-none text-[#F5E6C8]">
            {'\u2726'}
          </div>
          <div className="mt-4 font-display text-[20px] text-[#F5E6C8]">
            All Categories
          </div>
          <p className="mt-2 min-h-[44px] font-display text-[13px] leading-5 text-[#9A8B70]">
            The ultimate challenge
          </p>
          <div className="mt-5 text-sm uppercase tracking-[0.24em] text-[#C9A86A]">
            {totalCount} Questions
          </div>
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-6 rounded-[18px] border border-[rgba(184,134,11,0.12)] bg-[rgba(26,18,16,0.48)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-display text-[14px] uppercase tracking-[0.3em] text-[#9A8B70]">
            Question Count
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {QUESTION_COUNTS.map((count) => {
              const isActive = questionCount === count;

              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onQuestionCountChange(count)}
                  className="rounded-full border px-4 py-2 text-sm transition"
                  style={{
                    borderColor: isActive
                      ? empireColor
                      : 'rgba(184,134,11,0.16)',
                    backgroundColor: isActive
                      ? hexToRgba(empireColor, 0.14)
                      : 'transparent',
                    color: isActive ? '#F5E6C8' : '#9A8B70',
                  }}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedCategory}
          onClick={() => selectedCategory && onStart(selectedCategory)}
          className="rounded-full px-6 py-3 font-display text-[13px] uppercase tracking-[0.3em] text-[#120C08] transition disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: selectedCategory
              ? `linear-gradient(135deg, ${empireColor}, ${hexToRgba(
                  empireColor,
                  0.76
                )})`
              : 'linear-gradient(135deg, rgba(154,139,112,0.25), rgba(154,139,112,0.18))',
          }}
        >
          Begin Trial
        </button>
      </div>
    </div>
  );
}
