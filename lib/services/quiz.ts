import { QUIZ_DIFFICULTIES } from '@/lib/config/quiz-difficulties';
import { AppError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';
import type { QuizCategory, QuizConfig, QuizQuestion } from '@/lib/types/quiz';

const CATEGORY_DISPLAY: Record<
  string,
  { name: string; icon: string; description: string }
> = {
  culture: {
    name: 'Culture',
    icon: '',
    description: 'Art, philosophy, and daily life',
  },
  politics: {
    name: 'Politics',
    icon: '',
    description: 'Senate, laws, and governance',
  },
  rulers: {
    name: 'Rulers',
    icon: '',
    description: 'Emperors, dynasties, and succession',
  },
  religion: {
    name: 'Religion',
    icon: '\u26EA',
    description: 'Gods, cults, and Christianity',
  },
  geography: {
    name: 'Geography',
    icon: '',
    description: 'Provinces, cities, and roads',
  },
  battles: {
    name: 'Battles',
    icon: '\u2694',
    description: 'Wars, legions, and conquests',
  },
};

const CORRECT_MAP: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

/** Fisher-Yates shuffle - unbiased random permutation */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getQuizConfig(empireId: number): Promise<QuizConfig> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('category')
    .eq('empire_id', empireId);

  if (error) {
    throw new AppError(error.message, 'QUIZ_CONFIG', 500);
  }

  const counts = new Map<string, number>();

  for (const row of data ?? []) {
    const category = row.category;

    if (typeof category !== 'string' || !(category in CATEGORY_DISPLAY)) {
      continue;
    }

    counts.set(category, (counts.get(category) ?? 0) + 1);
  }

  const allCategories: QuizCategory[] = Array.from(counts.entries())
    .map(([id, count]) => ({
      id,
      count,
      ...CATEGORY_DISPLAY[id],
    }))
    .sort((a, b) => b.count - a.count);

  return {
    difficulties: QUIZ_DIFFICULTIES,
    allCategories,
  };
}

export async function getQuizQuestions(
  empireId: number,
  difficultyValue: number,
  category: string,
  count: number
): Promise<QuizQuestion[]> {
  const supabase = await createClient();

  let query = supabase
    .from('quiz_questions')
    .select(
      'id, question, option_a, option_b, option_c, option_d, correct, explanation, category'
    )
    .eq('empire_id', empireId)
    .eq('difficulty', difficultyValue);

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query.limit(count * 3);

  if (error) {
    throw new AppError(error.message, 'QUIZ_QUESTIONS', 500);
  }

  if (!data || data.length === 0) {
    throw new AppError(
      `No questions found for empire=${empireId}, difficulty=${difficultyValue}, category=${category}`,
      'QUIZ_NO_QUESTIONS',
      404
    );
  }

  const selected = shuffle(data).slice(0, Math.min(count, data.length));

  return selected.map((row) => ({
    id: row.id,
    question: row.question,
    options: [row.option_a, row.option_b, row.option_c, row.option_d],
    correctIndex: CORRECT_MAP[row.correct] ?? 0,
    explanation: row.explanation ?? null,
    category: row.category ?? 'unknown',
  }));
}
