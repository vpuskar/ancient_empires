import { AppError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';
import type {
  CompareAggregates,
  CompareData,
  EmpireExtentRow,
  RulerAtYear,
} from '@/lib/types/compare';

type CountQueryResult = {
  count: number | null;
  error: { message: string } | null;
};

type PeakAreaRow = {
  area_km2: number | null;
};

type ExtentQueryRow = {
  empire_id: number;
  year: number;
  area_km2: number | null;
  geojson_url: string | null;
};

function assertQuery<T extends { error: { message: string } | null }>(
  result: T,
  code: string
): T {
  if (result.error) {
    throw new AppError(result.error.message, code, 500);
  }

  return result;
}

function normaliseExtentRows(rows: ExtentQueryRow[]): EmpireExtentRow[] {
  return rows.map((row) => ({
    empire_id: row.empire_id,
    year: row.year,
    area_km2: row.area_km2 ?? 0,
    geojson_url: row.geojson_url ?? '',
  }));
}

export async function getCompareData(): Promise<CompareData> {
  const supabase = await createClient();
  const empireIds = [1, 2, 3, 4];

  const extentResult = await supabase
    .from('empire_extent')
    .select('empire_id, year, area_km2, geojson_url')
    .order('empire_id')
    .order('year');

  const extents = normaliseExtentRows(
    (assertQuery(extentResult, 'COMPARE_EXTENTS_FETCH').data ??
      []) as ExtentQueryRow[]
  );

  const aggregates = await Promise.all(
    empireIds.map(async (empireId): Promise<CompareAggregates> => {
      const [
        rulersCountResult,
        battlesCountResult,
        eventsCountResult,
        peakAreaResult,
      ] = await Promise.all([
        supabase
          .from('rulers')
          .select('*', { count: 'exact', head: true })
          .eq('empire_id', empireId),
        supabase
          .from('battles')
          .select('*', { count: 'exact', head: true })
          .eq('empire_id', empireId),
        supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('empire_id', empireId),
        supabase
          .from('empire_extent')
          .select('area_km2')
          .eq('empire_id', empireId)
          .order('area_km2', { ascending: false })
          .limit(1),
      ]);

      const rulersCount = assertQuery(
        rulersCountResult as CountQueryResult,
        'COMPARE_RULERS_COUNT'
      );
      const battlesCount = assertQuery(
        battlesCountResult as CountQueryResult,
        'COMPARE_BATTLES_COUNT'
      );
      const eventsCount = assertQuery(
        eventsCountResult as CountQueryResult,
        'COMPARE_EVENTS_COUNT'
      );
      const peakAreaRows = assertQuery(
        peakAreaResult,
        'COMPARE_PEAK_AREA_FETCH'
      ).data as PeakAreaRow[] | null;

      return {
        empire_id: empireId,
        ruler_count: rulersCount.count ?? 0,
        battle_count: battlesCount.count ?? 0,
        event_count: eventsCount.count ?? 0,
        peak_area_km2: peakAreaRows?.[0]?.area_km2 ?? 0,
      };
    })
  );

  return { extents, aggregates };
}

export async function getRulerAtYear(
  empireId: number,
  year: number
): Promise<RulerAtYear | null> {
  const supabase = await createClient();

  const result = await supabase
    .from('rulers')
    .select(
      'id, name, native_name, dynasty, reign_start, reign_end, bio_short, image_url'
    )
    .eq('empire_id', empireId)
    .lte('reign_start', year)
    .or(`reign_end.is.null,reign_end.gte.${year}`)
    .order('reign_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  const ruler = assertQuery(result, 'COMPARE_RULER_AT_YEAR_FETCH')
    .data as RulerAtYear | null;

  return ruler;
}
