import type {
  PersonalityQuestion,
  PersonalityResult,
  PersonalityVector,
  RulerProfile,
} from '@/lib/types/personality';

/** Build user vector by summing delta vectors from selected answers */
export function buildUserVector(
  answers: number[],
  questions: PersonalityQuestion[]
): PersonalityVector {
  const result: PersonalityVector = [0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < answers.length; i++) {
    const question = questions[i];

    if (!question) {
      continue;
    }

    const option = question.options[answers[i]];

    if (!option) {
      continue;
    }

    const delta = option.delta;

    for (let d = 0; d < 8; d++) {
      result[d] += delta[d];
    }
  }

  return result;
}

/** Cosine similarity between two vectors. Returns 0 for zero-magnitude vectors. */
export function cosineSimilarity(
  a: PersonalityVector,
  b: PersonalityVector
): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < 8; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
}

/**
 * Calculate personality result: match user against all rulers.
 *
 * CRITICAL: cosine similarity returns -1 to 1. We normalize to 0–100 using:
 *   matchPercent = Math.round(((similarity + 1) / 2) * 100)
 * This ensures matchPercent is ALWAYS 0–100, never negative.
 * -1 similarity -> 0%, 0 similarity -> 50%, 1 similarity -> 100%
 */
export function calculateResult(
  answers: number[],
  questions: PersonalityQuestion[],
  rulers: RulerProfile[]
): PersonalityResult {
  const userVector = buildUserVector(answers, questions);

  if (userVector.every((value) => value === 0)) {
    const fallbackRuler = rulers[0];

    return {
      ruler: fallbackRuler,
      matchPercent: 0,
      allScores: rulers.map((ruler) => ({ ruler, matchPercent: 0 })),
    };
  }

  const scores = rulers
    .map((ruler) => {
      const similarity = cosineSimilarity(userVector, ruler.vector);
      const matchPercent = Math.round(((similarity + 1) / 2) * 100);

      return { ruler, matchPercent };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);

  return {
    ruler: scores[0].ruler,
    matchPercent: scores[0].matchPercent,
    allScores: scores,
  };
}
