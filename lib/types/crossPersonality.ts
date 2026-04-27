import type { PersonalityResult } from '@/lib/types/personality';

// Enforces exactly 8 numbers - matches existing personality dimension order:
// power_style, conflict, legacy, innovation,
// people_focus, risk, moral_framework, charisma
export type PersonalityVector8 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type EmpireId = 1 | 2 | 3 | 4;

export type CrossEmpireOption = {
  text: string;
  delta: PersonalityVector8;
  empireBias?: Partial<Record<EmpireId, number>>;
};

export type CrossEmpireQuestion = {
  id: number;
  question: string;
  options: [
    CrossEmpireOption,
    CrossEmpireOption,
    CrossEmpireOption,
    CrossEmpireOption,
  ];
};

// EmpireScore and CrossPersonalityResult are referenced here for
// completeness but scoring is NOT implemented in this step.
// Algorithm step will import and use these types.
export type EmpireScore = {
  empireId: EmpireId;
  score: number;
  matchPercent: number;
};

export type CrossPersonalityResult = {
  winningEmpireId: EmpireId;
  empireScores: EmpireScore[];
  rulerResult: PersonalityResult;
  runnerUpEmpireId: EmpireId;
};
