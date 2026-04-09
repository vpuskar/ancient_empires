'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { calculateRank } from '@/lib/config/quiz-ranks';
import type { EmpireConfig } from '@/lib/empires/config';
import type {
  QuizConfig,
  QuizDifficultyLevel,
  QuizQuestion,
} from '@/lib/types/quiz';
import { CategorySelect } from './CategorySelect';
import { DifficultySelect } from './DifficultySelect';
import { QuestionScreen } from './QuestionScreen';
import { QuizProgress } from './QuizProgress';
import { QuizTimer } from './QuizTimer';
import { ScoreCard } from './ScoreCard';

type Screen = 'difficulty' | 'category' | 'loading' | 'playing' | 'score';

interface QuizGameProps {
  empire: EmpireConfig;
  config: QuizConfig;
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

function formatScore(score: number): string {
  return score % 1 === 0 ? score.toString() : score.toFixed(1);
}

function DifficultyBadge({
  difficulty,
  empireColor,
}: {
  difficulty: QuizDifficultyLevel;
  empireColor: string;
}) {
  return (
    <div
      className="rounded-full border px-4 py-2 text-right"
      style={{
        borderColor: hexToRgba(empireColor, 0.24),
        backgroundColor: hexToRgba(empireColor, 0.1),
      }}
    >
      <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
        Selected Rank
      </div>
      <div className="mt-1 font-display text-sm text-[#F5E6C8]">
        {difficulty.icon ? `${difficulty.icon} ` : ''}
        {difficulty.name}
      </div>
    </div>
  );
}

export function QuizGame({ empire, config }: QuizGameProps) {
  const [screen, setScreen] = useState<Screen>('difficulty');
  const [difficulty, setDifficulty] = useState<QuizDifficultyLevel | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rawScore, setRawScore] = useState(0);
  const [weightedScore, setWeightedScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRevealedRef = useRef(false);
  const currentIndexRef = useRef(0);
  const handleAnswerRef = useRef<(index: number) => void>(() => undefined);
  const scheduleAdvanceRef = useRef<() => void>(() => undefined);
  const hasFiredCompletionRef = useRef(false);

  const clearTimerInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const clearAdvanceTimeout = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };

  const clearQuizTimers = () => {
    clearTimerInterval();
    clearAdvanceTimeout();
  };

  useEffect(() => {
    isRevealedRef.current = isRevealed;
  }, [isRevealed]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  scheduleAdvanceRef.current = () => {
    if (!difficulty) {
      return;
    }

    clearAdvanceTimeout();

    advanceTimeoutRef.current = setTimeout(() => {
      advanceTimeoutRef.current = null;

      const last = currentIndexRef.current >= questions.length - 1;

      if (last) {
        clearTimerInterval();
        setScreen('score');
        return;
      }

      const next = currentIndexRef.current + 1;

      currentIndexRef.current = next;
      setCurrentIndex(next);
      setSelectedAnswer(null);
      setIsRevealed(false);
      isRevealedRef.current = false;
      setTimeLeft(difficulty.timer);
    }, 1500);
  };

  handleAnswerRef.current = (index: number) => {
    if (screen !== 'playing') {
      return;
    }

    if (isRevealedRef.current) {
      return;
    }

    isRevealedRef.current = true;

    setSelectedAnswer(index);
    setIsRevealed(true);
    clearTimerInterval();

    const question = questions[currentIndexRef.current];
    const isCorrect = index === question.correctIndex;

    if (isCorrect && difficulty) {
      setRawScore((prev) => prev + 1);
      setWeightedScore((prev) => prev + difficulty.multiplier);
    }

    setAnswers((previous) => {
      const next = [...previous];
      next[currentIndexRef.current] = index;
      return next;
    });

    scheduleAdvanceRef.current();
  };

  useEffect(() => {
    if (screen !== 'playing' || isRevealed) {
      clearTimerInterval();
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (!isRevealedRef.current) {
            isRevealedRef.current = true;
            setIsRevealed(true);
            setSelectedAnswer(null);
            setAnswers((previous) => {
              const next = [...previous];
              next[currentIndexRef.current] = null;
              return next;
            });
            scheduleAdvanceRef.current();
          }

          clearTimerInterval();
          return 0;
        }

        return prev - 1;
      });

      setTotalTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimerInterval();
    };
  }, [screen, isRevealed, currentIndex]);

  useEffect(() => {
    if (screen !== 'playing') {
      clearTimerInterval();
      clearAdvanceTimeout();
    }
  }, [screen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (screen !== 'playing' || isRevealedRef.current) {
        return;
      }

      const key = event.key.toLowerCase();
      const keyMap: Record<string, number> = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
        a: 0,
        b: 1,
        c: 2,
        d: 3,
      };

      const answerIndex = keyMap[key];

      if (answerIndex === undefined) {
        return;
      }

      event.preventDefault();
      handleAnswerRef.current(answerIndex);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [screen]);

  useEffect(() => {
    return () => {
      clearTimerInterval();
      clearAdvanceTimeout();
    };
  }, []);

  useEffect(() => {
    if (screen !== 'score') {
      return;
    }
    if (hasFiredCompletionRef.current) {
      return;
    }
    if (!difficulty) {
      return;
    }

    hasFiredCompletionRef.current = true;

    const posthog = (
      window as Window & {
        posthog?: {
          capture: (event: string, properties: Record<string, unknown>) => void;
        };
      }
    ).posthog;

    if (typeof window !== 'undefined' && posthog) {
      const rank = calculateRank(rawScore, questions.length, difficulty.name);

      posthog.capture('quiz_completed', {
        empire_id: empire.id,
        empire_slug: empire.slug,
        difficulty: difficulty.id,
        category,
        question_count: questions.length,
        raw_score: rawScore,
        weighted_score: weightedScore,
        percent: rank.percent,
        time_spent: totalTimeSpent,
        rank: rank.id,
      });
    }
  }, [
    screen,
    rawScore,
    weightedScore,
    totalTimeSpent,
    questions.length,
    difficulty,
    category,
    empire,
  ]);

  const startQuiz = async (selectedCategory: string) => {
    if (!difficulty) {
      return;
    }

    clearQuizTimers();
    setCategory(selectedCategory);
    setFetchError(null);
    setScreen('loading');

    try {
      const response = await fetch('/api/quiz/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empireId: empire.id,
          difficulty: difficulty.dbValue,
          category: selectedCategory,
          count: questionCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to load questions');
      }

      const data: QuizQuestion[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No questions returned');
      }

      setQuestions(data);
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      setRawScore(0);
      setWeightedScore(0);
      setSelectedAnswer(null);
      setIsRevealed(false);
      isRevealedRef.current = false;
      setTimeLeft(difficulty.timer);
      setTotalTimeSpent(0);
      setAnswers(new Array(data.length).fill(null));
      setFetchError(null);
      hasFiredCompletionRef.current = false;
      setScreen('playing');
    } catch {
      clearQuizTimers();
      isRevealedRef.current = false;
      setFetchError('Could not load questions. Please try again.');
      setScreen('category');
    }
  };

  const handlePlayAgain = () => {
    if (!category) {
      return;
    }

    isRevealedRef.current = false;
    startQuiz(category);
  };

  const handleChangeCategory = () => {
    clearQuizTimers();
    isRevealedRef.current = false;
    setSelectedAnswer(null);
    setIsRevealed(false);
    setCategory(null);
    setScreen('category');
  };

  const handleChangeRank = () => {
    clearQuizTimers();
    isRevealedRef.current = false;
    setSelectedAnswer(null);
    setIsRevealed(false);
    setDifficulty(null);
    setCategory(null);
    setScreen('difficulty');
  };

  const currentQuestion = questions[currentIndex] ?? null;

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
          className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
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
              <h1 className="mt-1 font-display text-[26px] text-[#F5E6C8]">
                Knowledge Arena
              </h1>
            </div>
          </div>

          {(screen === 'category' || screen === 'loading') && difficulty ? (
            <DifficultyBadge difficulty={difficulty} empireColor={empire.color} />
          ) : null}

          {screen === 'playing' ? (
            <div className="text-right">
              <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
                Current Trial
              </div>
              <div className="mt-1 font-display text-xl text-[#F5E6C8]">
                {formatScore(weightedScore)}
              </div>
              <div className="mt-1 text-sm text-[#9A8B70]">
                {rawScore}/{questions.length} correct
              </div>
            </div>
          ) : null}

          {screen === 'score' && difficulty ? (
            <div className="text-right">
              <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[#9A8B70]">
                Final Score
              </div>
              <div className="mt-1 font-display text-xl text-[#F5E6C8]">
                {formatScore(weightedScore)}
              </div>
            <div className="mt-1 text-sm text-[#9A8B70]">{difficulty.name}</div>
          </div>
        ) : null}
        </header>

        <div className="px-5 py-8 sm:px-8 sm:py-10">
          {screen === 'difficulty' ? (
            <DifficultySelect
              difficulties={config.difficulties}
              empireColor={empire.color}
              onSelect={(level) => {
                clearQuizTimers();
                isRevealedRef.current = false;
                setDifficulty(level);
                setFetchError(null);
                setScreen('category');
              }}
            />
          ) : null}

          {screen === 'category' && difficulty ? (
            <CategorySelect
              categories={config.allCategories}
              difficulty={difficulty}
              empireColor={empire.color}
              questionCount={questionCount}
              onQuestionCountChange={setQuestionCount}
              onStart={startQuiz}
              onBack={() => {
                clearQuizTimers();
                isRevealedRef.current = false;
                setScreen('difficulty');
              }}
              error={fetchError}
            />
          ) : null}

          {screen === 'loading' ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 text-center">
              <div
                className="h-14 w-14 animate-spin rounded-full border-2 border-t-transparent"
                style={{
                  borderColor: hexToRgba(empire.color, 0.25),
                  borderTopColor: 'transparent',
                }}
              />
              <p className="font-display text-3xl italic text-[#9A8B70]">
                Preparing your trial...
              </p>
            </div>
          ) : null}

          {screen === 'playing' && currentQuestion && difficulty ? (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <QuizProgress
                  current={currentIndex + 1}
                  total={questions.length}
                  difficultyName={difficulty.name}
                  difficultyIcon={difficulty.icon}
                  empireColor={empire.color}
                />
                <QuizTimer
                  timeLeft={timeLeft}
                  maxTime={difficulty.timer}
                  empireColor={empire.color}
                />
              </div>

              <QuestionScreen
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                isRevealed={isRevealed}
                empireColor={empire.color}
                onAnswer={(index) => handleAnswerRef.current(index)}
              />
            </div>
          ) : null}

          {screen === 'score' && difficulty ? (
            <ScoreCard
              rawScore={rawScore}
              weightedScore={weightedScore}
              totalQuestions={questions.length}
              totalTimeSpent={totalTimeSpent}
              difficulty={difficulty}
              empireColor={empire.color}
              onPlayAgain={handlePlayAgain}
              onChangeCategory={handleChangeCategory}
              onChangeRank={handleChangeRank}
            />
          ) : null}

          {screen === 'score' ? (
            <div className="mt-6 text-center text-sm text-[#9A8B70]">
              {answers.length} responses recorded
            </div>
          ) : null}
        </div>

        {screen === 'difficulty' || screen === 'score' ? (
          <footer
            className="border-t px-5 py-4 text-center sm:px-8"
            style={{ borderTop: '1px solid rgba(184,134,11,0.06)' }}
          >
            <div className="font-display text-[10px] uppercase tracking-[0.4em] text-[#4A3F34]">
              Ancient Empires {'\u00B7'} {empire.name} Quiz
            </div>
          </footer>
        ) : null}
      </section>
    </motion.div>
  );
}
