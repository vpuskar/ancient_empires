import type { QuizDifficultyLevel } from '@/lib/types/quiz';

export const QUIZ_DIFFICULTIES: QuizDifficultyLevel[] = [
  {
    id: 'plebs',
    name: 'Plebs',
    subtitle: 'Citizen of Rome',
    description: 'Straightforward questions for those beginning their journey',
    dbValue: 1,
    timer: 30,
    multiplier: 1,
    icon: '',
  },
  {
    id: 'legionarius',
    name: 'Legionarius',
    subtitle: 'Soldier of the Empire',
    description: 'Solid knowledge of key events, figures, and turning points',
    dbValue: 2,
    timer: 20,
    multiplier: 1.5,
    icon: '\u2694',
  },
  {
    id: 'senator',
    name: 'Senator',
    subtitle: 'Voice of the Republic',
    description: 'Precise recall of dates, places, and historical context',
    dbValue: 3,
    timer: 15,
    multiplier: 2,
    icon: '',
  },
  {
    id: 'imperator',
    name: 'Imperator',
    subtitle: 'Master of the Known World',
    description: 'Obscure details that challenge even historians',
    dbValue: 4,
    timer: 10,
    multiplier: 3,
    icon: '',
  },
];
