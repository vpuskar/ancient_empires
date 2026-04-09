'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { calculateResult } from '@/lib/config/personality/algorithm';
import type { EmpireConfig } from '@/lib/empires/config';
import type {
  PersonalityConfig,
  PersonalityResult,
} from '@/lib/types/personality';
import { IntroScreen } from './IntroScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';

interface PersonalityQuizProps {
  empire: EmpireConfig;
  config: PersonalityConfig;
}

export function PersonalityQuiz({ empire, config }: PersonalityQuizProps) {
  const [screen, setScreen] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const answerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (answerTimeoutRef.current) {
        clearTimeout(answerTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (screen !== 'result' || !result) {
      return;
    }

    if (hasFiredRef.current) {
      return;
    }

    hasFiredRef.current = true;

    if (
      typeof window !== 'undefined' &&
      (
        window as Window & {
          posthog?: {
            capture: (event: string, properties: Record<string, unknown>) => void;
          };
        }
      ).posthog
    ) {
      (
        window as Window & {
          posthog?: {
            capture: (event: string, properties: Record<string, unknown>) => void;
          };
        }
      ).posthog?.capture('personality_quiz_completed', {
        empire_id: empire.id,
        empire_slug: empire.slug,
        result_ruler: result.ruler.id,
        result_match_percent: result.matchPercent,
      });
    }
  }, [screen, result, empire.id, empire.slug]);

  const handleAnswer = (idx: number) => {
    if (selectedIdx !== null) {
      return;
    }

    setSelectedIdx(idx);

    if (answerTimeoutRef.current) {
      clearTimeout(answerTimeoutRef.current);
    }

    answerTimeoutRef.current = setTimeout(() => {
      const newAnswers = [...answers, idx];

      setAnswers(newAnswers);
      setSelectedIdx(null);

      if (currentIndex < config.questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        const personalityResult = calculateResult(
          newAnswers,
          config.questions,
          config.rulers
        );

        setResult(personalityResult);
        setScreen('result');
      }
    }, 600);
  };

  const handleRestart = () => {
    if (answerTimeoutRef.current) {
      clearTimeout(answerTimeoutRef.current);
    }

    hasFiredRef.current = false;
    setScreen('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedIdx(null);
    setResult(null);
  };

  const totalQuestions = config.questions.length;
  const currentQuestion = config.questions[currentIndex];

  const handleStart = () => {
    if (
      typeof window !== 'undefined' &&
      (
        window as Window & {
          posthog?: {
            capture: (event: string, properties: Record<string, unknown>) => void;
          };
        }
      ).posthog
    ) {
      (
        window as Window & {
          posthog?: {
            capture: (event: string, properties: Record<string, unknown>) => void;
          };
        }
      ).posthog?.capture('personality_quiz_started', {
        empire_id: empire.id,
        empire_slug: empire.slug,
      });
    }

    setScreen('playing');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
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
            <div
              className="h-12 w-[3px] rounded-full"
              style={{ backgroundColor: empire.color }}
            />
            <div>
              <div
                className="font-display text-[10px] uppercase tracking-[0.32em]"
                style={{ color: empire.color }}
              >
                {empire.name}
              </div>
              <h1 className="mt-1 font-display text-[24px] text-[#F5E6C8]">
                Personality Quiz
              </h1>
            </div>
          </div>

          {screen === 'playing' ? (
            <div className="font-display text-[13px] uppercase tracking-[0.2em] text-[#6B5B47]">
              {currentIndex + 1} / {totalQuestions}
            </div>
          ) : null}
        </header>

        <div className="px-5 py-8 sm:px-8 sm:py-10">
          {screen === 'intro' ? (
            <IntroScreen
              rulers={config.rulers}
              empireColor={empire.color}
              displayName={config.displayName}
              onStart={handleStart}
            />
          ) : null}

          {screen === 'playing' && currentQuestion ? (
            <div key={currentIndex} className="personality-question-enter">
              <QuestionScreen
                question={currentQuestion}
                index={currentIndex}
                total={config.questions.length}
                selectedIdx={selectedIdx}
                empireColor={empire.color}
                onAnswer={handleAnswer}
              />
            </div>
          ) : null}

          {screen === 'result' && result ? (
            <ResultScreen
              result={result}
              empireColor={empire.color}
              empireName={empire.name}
              empireSlug={empire.slug}
              onRestart={handleRestart}
            />
          ) : null}
        </div>

        {screen === 'intro' || screen === 'result' ? (
          <footer
            className="border-t px-5 py-4 text-center sm:px-8"
            style={{ borderTop: '1px solid rgba(184,134,11,0.06)' }}
          >
            <div className="font-display text-[10px] uppercase tracking-[0.4em] text-[#4A3F34]">
              Ancient Empires · {empire.name} Personality Quiz
            </div>
          </footer>
        ) : null}
      </section>
    </motion.div>
  );
}
