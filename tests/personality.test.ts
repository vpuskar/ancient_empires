import { describe, expect, it } from 'vitest';
import { calculateResult, cosineSimilarity } from '@/lib/config/personality/algorithm';
import { getPersonalityConfig } from '@/lib/config/personality';

describe('personality config', () => {
  it('returns Roman config for empire 1', () => {
    const config = getPersonalityConfig(1);

    expect(config).not.toBeNull();
    expect(config?.displayName).toBe('Roman');
    expect(config?.questions).toHaveLength(8);
    expect(config?.rulers).toHaveLength(6);
  });

  it('returns null for unsupported empires', () => {
    expect(getPersonalityConfig(4)).toBeNull();
  });
});

describe('personality algorithm', () => {
  it('normalizes matchPercent to 0-100', () => {
    const config = getPersonalityConfig(1);

    if (!config) {
      throw new Error('Roman config missing');
    }

    const result = calculateResult(
      new Array(config.questions.length).fill(0),
      config.questions,
      config.rulers
    );

    expect(result.matchPercent).toBeGreaterThanOrEqual(0);
    expect(result.matchPercent).toBeLessThanOrEqual(100);
    expect(result.allScores.every((score) => score.matchPercent >= 0)).toBe(true);
    expect(result.allScores.every((score) => score.matchPercent <= 100)).toBe(true);
  });

  it('returns 0 similarity for zero vectors', () => {
    expect(cosineSimilarity([0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0])).toBe(0);
  });
});
