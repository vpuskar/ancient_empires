export interface TimelineSnapshot {
  year: number;
  label: string;
  areaKm2: number;
  era: string;
  eraDesc: string;
  eraRange: string;
  ruler: string | null;
  provinces: string[];
  storyTitle: string;
  storySummary: string;
}

export interface TimelineMarker {
  year: number;
  label: string;
  title: string;
}

export interface TerritorialTimelineData {
  snapshots: TimelineSnapshot[];
  markers: TimelineMarker[];
  maxAreaKm2: number;
}
