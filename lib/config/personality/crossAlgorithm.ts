import {
  buildUserVector,
  calculateResult,
  cosineSimilarity,
} from '@/lib/config/personality/algorithm';
import { EMPIRE_ARCHETYPES } from '@/lib/config/personality/empireArchetypes';
import { getPersonalityConfig } from '@/lib/config/personality';
import type {
  CrossEmpireQuestion,
  CrossPersonalityResult,
  EmpireId,
  EmpireScore,
  PersonalityVector8,
} from '@/lib/types/crossPersonality';
import type { PersonalityResult } from '@/lib/types/personality';

const EMPIRE_IDS: EmpireId[] = [1, 2, 3, 4];

type BuildUserVectorQuestion = Parameters<typeof buildUserVector>[1][number];

function toBuildUserVectorQuestions(
  questions: CrossEmpireQuestion[]
): BuildUserVectorQuestion[] {
  return questions.map((question) => ({
    id: question.id,
    question: question.question,
    dimension: 'cross_empire',
    options: question.options,
  }));
}

function getBias(
  questions: CrossEmpireQuestion[],
  answers: number[],
  empireId: EmpireId
): number {
  return answers.reduce((total, answerIndex, questionIndex) => {
    const option = questions[questionIndex]?.options[answerIndex];

    return total + (option?.empireBias?.[empireId] ?? 0);
  }, 0);
}

function clampScore(score: number): number {
  return Math.max(-1, Math.min(1, score));
}

function toMatchPercent(score: number): number {
  return Math.round(((score + 1) / 2) * 100);
}

function calculateRulerResult(
  userVector: PersonalityVector8,
  winningEmpireId: EmpireId
): PersonalityResult {
  const config = getPersonalityConfig(winningEmpireId);

  if (!config) {
    throw new Error(`No personality config for empire ${winningEmpireId}`);
  }

  const allScores = config.rulers
    .map((ruler) => {
      const similarity = cosineSimilarity(userVector, ruler.vector);

      return {
        ruler,
        matchPercent: toMatchPercent(similarity),
      };
    })
    .sort((left, right) => right.matchPercent - left.matchPercent);

  return {
    ruler: allScores[0].ruler,
    matchPercent: allScores[0].matchPercent,
    allScores,
  };
}

export function calculateCrossEmpireResult(
  questions: CrossEmpireQuestion[],
  answers: number[]
): CrossPersonalityResult {
  void calculateResult;

  const userVector = buildUserVector(
    answers,
    toBuildUserVectorQuestions(questions)
  );

  const empireScores: EmpireScore[] = EMPIRE_IDS.map((empireId) => {
    const base = cosineSimilarity(userVector, EMPIRE_ARCHETYPES[empireId]);
    const bias = getBias(questions, answers, empireId);
    const rawScore = clampScore(base + bias);

    return {
      empireId,
      score: rawScore,
      matchPercent: toMatchPercent(rawScore),
    };
  }).sort((left, right) => right.matchPercent - left.matchPercent);

  const winningEmpireId = empireScores[0].empireId;
  const rulerResult = calculateRulerResult(userVector, winningEmpireId);

  return {
    winningEmpireId,
    empireScores,
    rulerResult,
    runnerUpEmpireId: empireScores[1].empireId,
  };
}
