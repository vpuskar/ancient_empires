/** 8 personality dimensions: power_style, conflict, legacy, innovation, people_focus, risk, moral_framework, charisma */
export type PersonalityVector = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export interface PersonalityOption {
  text: string;
  delta: PersonalityVector;
}

export interface PersonalityQuestion {
  id: number;
  question: string;
  dimension: string;
  options: [
    PersonalityOption,
    PersonalityOption,
    PersonalityOption,
    PersonalityOption,
  ];
}

export interface RulerProfile {
  id: string;
  name: string;
  title: string;
  years: string;
  portrait: string;
  color: string;
  description: string;
  traits: string[];
  vector: PersonalityVector;
}

export interface PersonalityConfig {
  questions: PersonalityQuestion[];
  rulers: RulerProfile[];
  displayName: string;
}

export interface PersonalityResult {
  ruler: RulerProfile;
  matchPercent: number;
  allScores: { ruler: RulerProfile; matchPercent: number }[];
}
