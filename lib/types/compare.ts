export interface EmpireExtentRow {
  empire_id: number;
  year: number;
  area_km2: number;
  geojson_url: string;
}

export interface CompareAggregates {
  empire_id: number;
  ruler_count: number;
  battle_count: number;
  event_count: number;
  peak_area_km2: number;
}

export interface CompareData {
  extents: EmpireExtentRow[];
  aggregates: CompareAggregates[];
}

export interface RulerAtYear {
  id: number;
  name: string;
  native_name: string | null;
  dynasty: string | null;
  reign_start: number;
  reign_end: number | null;
  bio_short: string | null;
  image_url: string | null;
}
