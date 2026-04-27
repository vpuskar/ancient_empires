'use client';

import { useState } from 'react';
import { calculateCrossEmpireResult } from '@/lib/config/personality/crossAlgorithm';
import { CROSS_QUESTIONS } from '@/lib/config/personality/crossQuestions';
import type { CrossPersonalityResult } from '@/lib/types/crossPersonality';
import { CrossEmpireResultCard } from './CrossEmpireResultCard';

type QuizView = 'intro' | 'playing' | 'result';

export default function CrossPersonalityQuiz() {
  const [view, setView] = useState<QuizView>('intro');
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<CrossPersonalityResult | null>(null);

  const currentQuestion = CROSS_QUESTIONS[answers.length];
  const totalQuestions = CROSS_QUESTIONS.length;

  const handleAnswer = (answerIndex: number) => {
    const updatedAnswers = [...answers, answerIndex];

    setAnswers(updatedAnswers);

    if (answers.length < totalQuestions - 1) {
      return;
    }

    setResult(calculateCrossEmpireResult(CROSS_QUESTIONS, updatedAnswers));
    setView('result');
  };

  const handleRetake = () => {
    setView('intro');
    setAnswers([]);
    setResult(null);
  };

  return (
    <section
      className="overflow-hidden rounded-[28px] border"
      style={{
        borderColor: 'rgba(184, 134, 11, 0.12)',
        background:
          'linear-gradient(180deg, rgba(20, 13, 10, 0.92) 0%, rgba(15, 11, 9, 0.98) 100%)',
        boxShadow:
          '0 24px 90px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(245, 230, 200, 0.04)',
      }}
    >
      <header
        className="flex flex-col gap-3 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        style={{ borderBottom: '1px solid rgba(184,134,11,0.08)' }}
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-[3px] rounded-full bg-[#B8860B]" />
          <div>
            <div className="font-display text-[10px] uppercase tracking-[0.32em] text-[#B8860B]">
              Ancient Empires
            </div>
            <h1 className="mt-1 font-display text-[24px] text-[#F5E6C8]">
              Cross-Empire Personality
            </h1>
          </div>
        </div>

        {view === 'playing' ? (
          <div className="font-display text-[13px] uppercase tracking-[0.2em] text-[#6B5B47]">
            {answers.length + 1} / {totalQuestions}
          </div>
        ) : null}
      </header>

      <div className="px-5 py-8 sm:px-8 sm:py-10">
        {view === 'intro' ? (
          <div className="flex min-h-[70vh] items-center justify-center py-8">
            <div className="mx-auto flex w-full max-w-[520px] flex-col items-center text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full border text-[38px] leading-none"
                style={{
                  borderColor: 'rgba(184,134,11,0.24)',
                  background:
                    'radial-gradient(circle at 50% 40%, rgba(184,134,11,0.28) 0%, rgba(184,134,11,0.12) 42%, rgba(12, 8, 6, 0.1) 100%)',
                  boxShadow: '0 0 50px rgba(184,134,11,0.2)',
                }}
                aria-hidden="true"
              >
                *
              </div>

              <div className="mt-8">
                <h2 className="font-display text-[30px] leading-[1.2] text-[#F5E6C8]">
                  Which empire claims you?
                </h2>
                <p className="mt-4 font-body text-[16px] italic leading-[1.6] text-[#B8860B]">
                  10 questions. Four empires competing for your soul.
                </p>
                <p className="mx-auto mt-5 max-w-[460px] font-body text-[15px] leading-[1.7] text-[#9A8B70]">
                  Your answers will be matched against the governing temperament
                  of four great empires. First you will be matched to an empire,
                  then to the ruler within that tradition whose profile most
                  closely aligns with yours.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setView('playing')}
                className="mt-10 rounded-[8px] bg-[linear-gradient(135deg,#B8860B,rgba(184,134,11,0.78))] px-12 py-[14px] font-display text-[14px] uppercase tracking-[0.3em] text-[#F5E6C8] shadow-[0_16px_36px_rgba(184,134,11,0.16)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120C08] focus-visible:outline-none"
              >
                Begin
              </button>
            </div>
          </div>
        ) : null}

        {view === 'playing' && currentQuestion ? (
          <div
            key={currentQuestion.id}
            className="personality-question-enter mx-auto flex w-full max-w-[620px] flex-col gap-8"
          >
            <div className="w-full">
              <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
                Question {answers.length + 1} of {totalQuestions}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {CROSS_QUESTIONS.map((question, index) => {
                  const isComplete = index < answers.length;
                  const isActive = index === answers.length;

                  return (
                    <div
                      key={question.id}
                      className="h-2 w-2 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor:
                          isComplete || isActive
                            ? '#B8860B'
                            : 'rgba(184,134,11,0.1)',
                        opacity: isActive ? 1 : isComplete ? 0.7 : 1,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <h2 className="font-body text-[24px] leading-[1.4] font-semibold text-[#F5E6C8]">
              {currentQuestion.question}
            </h2>

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={`${currentQuestion.id}-${optionIndex}`}
                  type="button"
                  onClick={() => handleAnswer(optionIndex)}
                  aria-label={option.text}
                  className="flex items-center gap-4 rounded-[16px] border border-[rgba(184,134,11,0.1)] bg-[rgba(26,18,16,0.6)] px-4 py-4 text-left text-[#C4B69A] transition-all duration-200 hover:bg-[rgba(184,134,11,0.04)] hover:text-[#F5E6C8] focus-visible:ring-2 focus-visible:ring-[#B8860B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120C08] focus-visible:outline-none"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-[rgba(184,134,11,0.12)] bg-[rgba(20,13,10,0.45)] font-display text-[12px] text-[#9A8B70]">
                    {String.fromCharCode(65 + optionIndex)}
                  </div>

                  <span className="font-body text-[16px] leading-[1.5]">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {view === 'result' && result ? (
          <CrossEmpireResultCard result={result} onRetake={handleRetake} />
        ) : null}
      </div>

      {view === 'intro' || view === 'result' ? (
        <footer
          className="border-t px-5 py-4 text-center sm:px-8"
          style={{ borderTop: '1px solid rgba(184,134,11,0.06)' }}
        >
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-[#4A3F34]">
            Ancient Empires - Cross-Empire Personality Quiz
          </div>
        </footer>
      ) : null}
    </section>
  );
}
