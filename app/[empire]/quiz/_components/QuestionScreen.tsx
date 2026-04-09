import type { QuizQuestion } from '@/lib/types/quiz';

interface QuestionScreenProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  isRevealed: boolean;
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
  selectedAnswer,
  isRevealed,
  empireColor,
  onAnswer,
}: QuestionScreenProps) {
  return (
    <div className="space-y-6">
      <section
        className="rounded-[22px] border px-6 py-7 sm:px-8"
        style={{
          borderColor: hexToRgba(empireColor, 0.14),
          background:
            'linear-gradient(180deg, rgba(30, 20, 17, 0.72) 0%, rgba(19, 14, 11, 0.88) 100%)',
        }}
      >
        <div
          className="font-display text-[10px] uppercase tracking-[0.34em]"
          style={{ color: empireColor }}
        >
          {question.category}
        </div>
        <h2 className="mt-4 font-display text-[24px] leading-9 text-[#F5E6C8] sm:text-[30px]">
          {question.question}
        </h2>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = question.correctIndex === index;
          const isWrongSelected = isRevealed && isSelected && !isCorrect;

          let borderColor = 'rgba(184,134,11,0.12)';
          let backgroundColor = 'rgba(26,18,16,0.6)';

          if (isRevealed && isCorrect) {
            borderColor = '#D4AF37';
            backgroundColor = 'rgba(212,175,55,0.12)';
          } else if (isWrongSelected) {
            borderColor = '#B24A3A';
            backgroundColor = 'rgba(178,74,58,0.14)';
          } else if (isSelected) {
            borderColor = empireColor;
            backgroundColor = hexToRgba(empireColor, 0.14);
          }

          return (
            <button
              key={`${question.id}-${index}`}
              type="button"
              onClick={() => onAnswer(index)}
              disabled={isRevealed}
              className="rounded-[18px] border px-5 py-5 text-left transition duration-200 disabled:cursor-default"
              style={{
                borderColor,
                backgroundColor,
                boxShadow: isSelected
                  ? `0 18px 40px ${hexToRgba(empireColor, 0.1)}`
                  : 'none',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-display text-sm text-[#F5E6C8]"
                  style={{
                    borderColor: isRevealed && isCorrect ? '#D4AF37' : hexToRgba(empireColor, 0.2),
                    backgroundColor:
                      isRevealed && isCorrect
                        ? 'rgba(212,175,55,0.14)'
                        : hexToRgba(empireColor, 0.08),
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1">
                  <div className="font-display text-lg leading-7 text-[#F5E6C8]">
                    {option}
                  </div>
                  {isRevealed ? (
                    <div
                      className="mt-3 text-sm"
                      style={{
                        color: isCorrect
                          ? '#D4AF37'
                          : isWrongSelected
                            ? '#E28F7A'
                            : '#9A8B70',
                      }}
                    >
                      {isCorrect
                        ? 'Correct answer'
                        : isWrongSelected
                          ? 'Incorrect answer'
                          : ' '}
                    </div>
                  ) : (
                    <div className="mt-3 text-sm text-[#9A8B70]">
                      Press {index + 1} or {String.fromCharCode(65 + index)}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-[18px] border px-5 py-4 transition duration-500"
        style={{
          borderColor: hexToRgba(empireColor, 0.14),
          backgroundColor: 'rgba(26,18,16,0.48)',
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(8px)',
          pointerEvents: 'none',
        }}
      >
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
          Explanation
        </div>
        <p className="mt-3 font-display text-[16px] leading-7 text-[#F5E6C8]">
          {question.explanation ?? 'No explanation provided for this question.'}
        </p>
      </div>
    </div>
  );
}
