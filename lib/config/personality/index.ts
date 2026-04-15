import type { PersonalityConfig } from '@/lib/types/personality';
import { OTTOMAN_PERSONALITY } from './ottoman';
import { ROMAN_PERSONALITY } from './roman';

const PERSONALITY_CONFIGS: Record<number, PersonalityConfig> = {
  1: ROMAN_PERSONALITY,
  // 2: CHINESE_PERSONALITY,
  // 3: JAPANESE_PERSONALITY,
  4: OTTOMAN_PERSONALITY,
};

export function getPersonalityConfig(
  empireId: number
): PersonalityConfig | null {
  return PERSONALITY_CONFIGS[empireId] ?? null;
}
