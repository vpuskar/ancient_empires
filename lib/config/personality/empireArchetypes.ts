import type {
  EmpireId,
  PersonalityVector8,
} from '@/lib/types/crossPersonality';

// Curated archetype vectors - not objective historical data.
// Editorial product scores representing each empire's identity profile.
// Dimension order: power_style, conflict, legacy, innovation,
//                  people_focus, risk, moral_framework, charisma
export const EMPIRE_ARCHETYPES: Record<EmpireId, PersonalityVector8> = {
  1: [0.8, 0.7, 0.9, 0.5, 0.5, 0.6, 0.8, 0.7], // Roman: law, military, governance
  2: [0.6, 0.4, 0.9, 0.8, 0.7, 0.3, 0.8, 0.6], // Chinese: philosophy, continuity, innovation
  3: [0.5, 0.6, 0.8, 0.6, 0.6, 0.5, 0.9, 0.7], // Japanese: honour, tradition, loyalty
  4: [0.7, 0.6, 0.7, 0.7, 0.8, 0.5, 0.7, 0.8], // Ottoman: synthesis, tolerance, grandeur
};
