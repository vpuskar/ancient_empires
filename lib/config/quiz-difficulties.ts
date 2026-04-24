import type { QuizDifficultyLevel } from '@/lib/types/quiz';

interface DifficultyLabelSet {
  name: string;
  subtitle: string;
}

interface DifficultyBaseConfig {
  id: string;
  dbValue: number;
  timer: number;
  multiplier: number;
  icon: string;
  description: string;
}

const BASE_DIFFICULTIES: DifficultyBaseConfig[] = [
  {
    id: 'plebs',
    dbValue: 1,
    timer: 30,
    multiplier: 1,
    icon: '',
    description: 'Straightforward questions for those beginning their journey',
  },
  {
    id: 'legionarius',
    dbValue: 2,
    timer: 20,
    multiplier: 1.5,
    icon: '\u2694',
    description: 'Solid knowledge of key events, figures, and turning points',
  },
  {
    id: 'senator',
    dbValue: 3,
    timer: 15,
    multiplier: 2,
    icon: '',
    description: 'Precise recall of dates, places, and historical context',
  },
  {
    id: 'imperator',
    dbValue: 4,
    timer: 10,
    multiplier: 3,
    icon: '',
    description: 'Obscure details that challenge even historians',
  },
];

const GENERIC_DIFFICULTY_LABELS: Record<number, DifficultyLabelSet> = {
  1: {
    name: 'Beginner',
    subtitle: 'First steps into the past',
  },
  2: {
    name: 'Intermediate',
    subtitle: 'Test your growing command',
  },
  3: {
    name: 'Advanced',
    subtitle: 'Demanding historical recall',
  },
  4: {
    name: 'Expert',
    subtitle: 'For the most exacting minds',
  },
};

const EMPIRE_DIFFICULTY_LABELS: Record<
  number,
  Partial<Record<number, DifficultyLabelSet>>
> = {
  1: {
    1: {
      name: 'Plebs',
      subtitle: 'Citizen of Rome',
    },
    2: {
      name: 'Legionarius',
      subtitle: 'Soldier of the Empire',
    },
    3: {
      name: 'Senator',
      subtitle: 'Voice of the Republic',
    },
    4: {
      name: 'Imperator',
      subtitle: 'Master of the Known World',
    },
  },
  2: {
    1: {
      name: 'Xiucai',
      subtitle: 'Cultivated Talent',
    },
    2: {
      name: 'Juren',
      subtitle: 'Recommended Man',
    },
    3: {
      name: 'Jinshi',
      subtitle: 'Presented Scholar',
    },
    4: {
      name: 'Zhuangyuan',
      subtitle: 'Top Scholar of the Realm',
    },
  },
  3: {
    1: {
      name: 'Heimin',
      subtitle: 'Commoner',
    },
    2: {
      name: 'Samurai',
      subtitle: 'Warrior',
    },
    3: {
      name: 'Daimyo',
      subtitle: 'Domain Lord',
    },
    4: {
      name: 'Shogun',
      subtitle: 'Supreme Commander',
    },
  },
  4: {
    1: {
      name: 'Reaya',
      subtitle: 'Subject of the Empire',
    },
    2: {
      name: 'Sipahi',
      subtitle: 'Cavalryman of the Sultan',
    },
    3: {
      name: 'Pasha',
      subtitle: 'Governor and Commander',
    },
    4: {
      name: 'Vizier',
      subtitle: 'Chief Minister of the Realm',
    },
  },
};

function resolveLabels(empireId: number, dbValue: number): DifficultyLabelSet {
  return (
    EMPIRE_DIFFICULTY_LABELS[empireId]?.[dbValue] ??
    GENERIC_DIFFICULTY_LABELS[dbValue]
  );
}

export function getQuizDifficulties(empireId: number): QuizDifficultyLevel[] {
  return BASE_DIFFICULTIES.map((difficulty) => ({
    ...difficulty,
    ...resolveLabels(empireId, difficulty.dbValue),
  }));
}

export const QUIZ_DIFFICULTIES = getQuizDifficulties(1);
