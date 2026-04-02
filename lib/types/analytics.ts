export interface DynastyCount {
  name: string;
  count: number;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface OutcomeCount {
  name: string;
  count: number;
}

export interface CenturyActivity {
  century: string;
  events: number;
  battles: number;
}

export interface TerritorialPoint {
  year: number;
  areaKm2: number;
  label: string;
}

export interface PlaceTypeCount {
  type: string;
  label: string;
  count: number;
}

export interface AnalyticsSummary {
  totals: {
    rulers: number;
    places: number;
    battles: number;
    events: number;
    provinces: number;
  };
  dynastyByCounts: DynastyCount[];
  eventsByCategory: CategoryCount[];
  battleOutcomes: OutcomeCount[];
  centuryActivity: CenturyActivity[];
  territorialExtent: TerritorialPoint[];
  placesByType: PlaceTypeCount[];
}
