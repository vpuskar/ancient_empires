export interface QuizRank {
  id: string;
  name: string;
  minPercent: number;
  description: string;
  color: string;
}

export const QUIZ_RANKS: QuizRank[] = [
  {
    id: 'triumphator',
    name: 'Triumphator',
    minPercent: 90,
    description: 'Flawless - you have earned a Triumph through Rome',
    color: '#B8860B',
  },
  {
    id: 'praetor',
    name: 'Praetor',
    minPercent: 70,
    description: 'A commanding performance worthy of honour',
    color: '#C4B69A',
  },
  {
    id: 'centurion',
    name: 'Centurion',
    minPercent: 50,
    description: 'Solid knowledge - the backbone of any campaign',
    color: '#9A8B70',
  },
  {
    id: 'miles',
    name: 'Miles',
    minPercent: 30,
    description: "A footsoldier's beginning - study and return stronger",
    color: '#6B5B47',
  },
  {
    id: 'tiro',
    name: 'Tiro',
    minPercent: 0,
    description: 'Every recruit must start somewhere',
    color: '#4A4A4A',
  },
];

export function calculateRank(
  correctCount: number,
  totalCount: number,
  difficultyName: string
): QuizRank & { percent: number; displayDesc: string } {
  if (totalCount <= 0) {
    const fallback = QUIZ_RANKS[QUIZ_RANKS.length - 1];
    return {
      ...fallback,
      percent: 0,
      displayDesc: `${fallback.description} at ${difficultyName} level`,
    };
  }

  const percent = Math.round((correctCount / totalCount) * 100);
  const rank =
    QUIZ_RANKS.find((item) => percent >= item.minPercent) ??
    QUIZ_RANKS[QUIZ_RANKS.length - 1];

  return {
    ...rank,
    percent,
    displayDesc: `${rank.description} at ${difficultyName} level`,
  };
}
