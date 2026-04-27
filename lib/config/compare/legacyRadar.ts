export type LegacyDimensions = {
  governance: number;
  architecture: number;
  science: number;
  language: number;
  philosophy: number;
};

export type LegacyProfile = {
  dimensions: LegacyDimensions;
};

// Curated product scores (0-100). Not objective historical data.
// Intended to represent relative cultural legacy as a discussion prompt.
export const LEGACY_RADAR_DATA: Record<number, LegacyProfile> = {
  1: {
    dimensions: {
      governance: 95,
      architecture: 90,
      science: 72,
      language: 88,
      philosophy: 78,
    },
  },
  2: {
    dimensions: {
      governance: 85,
      architecture: 88,
      science: 92,
      language: 95,
      philosophy: 90,
    },
  },
  3: {
    dimensions: {
      governance: 72,
      architecture: 82,
      science: 70,
      language: 78,
      philosophy: 88,
    },
  },
  4: {
    dimensions: {
      governance: 80,
      architecture: 85,
      science: 75,
      language: 68,
      philosophy: 72,
    },
  },
};
