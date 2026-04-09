'use client';

import type { PersonalityQuestion } from '@/lib/types/personality';
import { QuestionProgress } from './QuestionProgress';

interface QuestionScreenProps {
  question: PersonalityQuestion;
  index: number;
  total: number;
  selectedIdx: number | null;
  empireColor: string;
  onAnswer: (index: number) => void;
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

export function QuestionScreen({
  question,
  index,
  total,
  selectedIdx,
  empireColor,
  onAnswer,
}: QuestionScreenProps) {
  const isLocked = selectedIdx !== null;

  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col gap-8">
      <QuestionProgress
        current={index}
        total={total}
        dimension={question.dimension}
        empireColor={empireColor}
      />

      <h2 className="font-body text-[24px] leading-[1.4] font-semibold text-[#F5E6C8]">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedIdx === optionIndex;
          const isDisabled = isLocked && !isSelected;

          return (
            <button
              key={`${question.id}-${optionIndex}`}
              type="button"
              onClick={() => onAnswer(optionIndex)}
              disabled={isLocked}
              className="flex items-center gap-4 rounded-[16px] border px-4 py-4 text-left transition-all duration-200 ease-[ease] disabled:cursor-default"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(184,134,11,0.1)'
                  : 'rgba(26,18,16,0.6)',
                border: isSelected
                  ? `2px solid ${hexToRgba(empireColor, 0.5)}`
                  : '1px solid rgba(184,134,11,0.1)',
                color: isSelected
                  ? '#F5E6C8'
                  : isDisabled
                    ? 'rgba(196,182,154,0.55)'
                    : '#C4B69A',
                cursor: isLocked ? 'default' : 'pointer',
                pointerEvents: isLocked ? 'none' : 'auto',
                opacity: isDisabled ? 0.7 : 1,
              }}
              onMouseEnter={(event) => {
                if (isLocked || isSelected) {
                  return;
                }

                event.currentTarget.style.backgroundColor = 'rgba(184,134,11,0.04)';
                event.currentTarget.style.color = '#F5E6C8';
              }}
              onMouseLeave={(event) => {
                if (isLocked || isSelected) {
                  return;
                }

                event.currentTarget.style.backgroundColor = 'rgba(26,18,16,0.6)';
                event.currentTarget.style.color = '#C4B69A';
              }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] font-display text-[12px]"
                style={{
                  border: isSelected
                    ? '1px solid #B8860B'
                    : '1px solid rgba(184,134,11,0.12)',
                  color: isSelected ? '#B8860B' : '#9A8B70',
                  backgroundColor: isSelected
                    ? 'rgba(184,134,11,0.08)'
                    : 'rgba(20,13,10,0.45)',
                  transition: 'all 0.25s ease',
                }}
              >
                {String.fromCharCode(65 + optionIndex)}
              </div>

              <span className="font-body text-[16px] leading-[1.5]">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
