import { AppError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';
import type {
  AnalyticsSummary,
  CategoryCount,
  CenturyActivity,
  DynastyCount,
  OutcomeCount,
  PlaceTypeCount,
  TerritorialPoint,
} from '@/lib/types/analytics';

type CountQueryResult = {
  count: number | null;
  error: { message: string } | null;
};

type RulerDynastyRow = {
  dynasty: string | null;
};

type EventCategoryRow = {
  category: string | null;
};

type BattleOutcomeRow = {
  outcome: string | null;
};

type YearRow = {
  year: number | null;
};

type EmpireExtentRow = {
  year: number;
  area_km2: number | null;
  notes: string | null;
};

type PlaceTypeRow = {
  type: string | null;
};

type PlaceTypeKey =
  | 'city'
  | 'fort'
  | 'temple'
  | 'battle_site'
  | 'road'
  | 'port'
  | 'palace'
  | 'other';

const PLACE_TYPE_LABELS: Record<PlaceTypeKey, string> = {
  city: 'City',
  fort: 'Fort',
  temple: 'Temple',
  battle_site: 'Battle Site',
  road: 'Road',
  port: 'Port',
  palace: 'Palace',
  other: 'Other',
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

function bucketLabel(value: string | null | undefined, fallback: string): string {
  const normalised = value?.trim();
  return normalised && normalised.length > 0 ? normalised : fallback;
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function normaliseOutcome(value: string | null): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return 'Unknown';
  }

  return toTitleCase(trimmed.toLowerCase());
}

function ordinal(century: number): string {
  const remainder10 = century % 10;
  const remainder100 = century % 100;

  if (remainder10 === 1 && remainder100 !== 11) return `${century}st`;
  if (remainder10 === 2 && remainder100 !== 12) return `${century}nd`;
  if (remainder10 === 3 && remainder100 !== 13) return `${century}rd`;
  return `${century}th`;
}

function getCenturyInfo(
  year: number
): { key: string; label: string; sortGroup: 0 | 1; sortValue: number } {
  const absoluteYear = Math.abs(year);
  const centuryNumber = Math.floor((absoluteYear - 1) / 100) + 1;

  if (year < 0) {
    return {
      key: `BC-${centuryNumber}`,
      label: `${ordinal(centuryNumber)} BC`,
      sortGroup: 0,
      sortValue: -centuryNumber,
    };
  }

  return {
    key: `AD-${centuryNumber}`,
    label: `${ordinal(centuryNumber)} AD`,
    sortGroup: 1,
    sortValue: centuryNumber,
  };
}

function sortCountEntries<T extends { name: string; count: number }>(
  entries: T[]
): T[] {
  return [...entries].sort((left, right) => {
    if (right.count !== left.count) {
      return right.count - left.count;
    }

    return left.name.localeCompare(right.name);
  });
}

function groupByLabel<T extends { [key: string]: string | null }>(
  rows: T[],
  field: keyof T,
  fallback: string
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const label = bucketLabel(row[field] as string | null, fallback);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return counts;
}

function buildDynastyCounts(rows: RulerDynastyRow[]): DynastyCount[] {
  return sortCountEntries(
    Array.from(groupByLabel(rows, 'dynasty', 'Unknown')).map(
      ([name, count]) => ({
        name,
        count,
      })
    )
  );
}

function buildCategoryCounts(rows: EventCategoryRow[]): CategoryCount[] {
  return sortCountEntries(
    Array.from(groupByLabel(rows, 'category', 'Uncategorised')).map(
      ([name, count]) => ({
        name,
        count,
      })
    )
  );
}

function buildOutcomeCounts(rows: BattleOutcomeRow[]): OutcomeCount[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const label = normaliseOutcome(row.outcome);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return sortCountEntries(
    Array.from(counts).map(([name, count]) => ({
      name,
      count,
    }))
  );
}

function buildCenturyActivity(
  eventRows: YearRow[],
  battleRows: YearRow[]
): CenturyActivity[] {
  const buckets = new Map<
    string,
    {
      label: string;
      sortGroup: 0 | 1;
      sortValue: number;
      events: number;
      battles: number;
    }
  >();

  for (const row of eventRows) {
    if (row.year === null || row.year === 0) {
      continue;
    }

    const century = getCenturyInfo(row.year);
    const bucket = buckets.get(century.key) ?? {
      label: century.label,
      sortGroup: century.sortGroup,
      sortValue: century.sortValue,
      events: 0,
      battles: 0,
    };
    bucket.events += 1;
    buckets.set(century.key, bucket);
  }

  for (const row of battleRows) {
    if (row.year === null || row.year === 0) {
      continue;
    }

    const century = getCenturyInfo(row.year);
    const bucket = buckets.get(century.key) ?? {
      label: century.label,
      sortGroup: century.sortGroup,
      sortValue: century.sortValue,
      events: 0,
      battles: 0,
    };
    bucket.battles += 1;
    buckets.set(century.key, bucket);
  }

  return Array.from(buckets.values())
    .sort((left, right) => {
      if (left.sortGroup !== right.sortGroup) {
        return left.sortGroup - right.sortGroup;
      }

      return left.sortValue - right.sortValue;
    })
    .map((bucket) => ({
      century: bucket.label,
      events: bucket.events,
      battles: bucket.battles,
    }));
}

function buildTerritorialExtent(rows: EmpireExtentRow[]): TerritorialPoint[] {
  return rows
    .map((row) => ({
      year: row.year,
      areaKm2: row.area_km2 ?? 0,
      label: row.notes?.trim() || '',
    }))
    .sort((left, right) => left.year - right.year);
}

function normalisePlaceType(value: string | null): PlaceTypeKey {
  const trimmed = value?.trim().toLowerCase();

  if (!trimmed) {
    return 'other';
  }

  return trimmed in PLACE_TYPE_LABELS
    ? (trimmed as PlaceTypeKey)
    : 'other';
}

function buildPlaceTypeCounts(rows: PlaceTypeRow[]): PlaceTypeCount[] {
  const counts = new Map<PlaceTypeKey, number>();

  for (const row of rows) {
    const type = normalisePlaceType(row.type);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }

  return Array.from(counts)
    .map(([type, count]) => ({
      type,
      label: PLACE_TYPE_LABELS[type],
      count,
    }))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }

      return left.label.localeCompare(right.label);
    });
}

export async function getAnalyticsData(
  empireId: number
): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  const [
    rulersCountResult,
    placesCountResult,
    battlesCountResult,
    eventsCountResult,
    provincesCountResult,
    dynastyResult,
    categoryResult,
    outcomeResult,
    eventYearsResult,
    battleYearsResult,
    territorialExtentResult,
    placeTypesResult,
  ] = await Promise.all([
    supabase
      .from('rulers')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('places')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('battles')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('provinces')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase.from('rulers').select('dynasty').eq('empire_id', empireId),
    supabase.from('events').select('category').eq('empire_id', empireId),
    supabase.from('battles').select('outcome').eq('empire_id', empireId),
    supabase.from('events').select('year').eq('empire_id', empireId),
    supabase.from('battles').select('year').eq('empire_id', empireId),
    supabase
      .from('empire_extent')
      .select('year, area_km2, notes')
      .eq('empire_id', empireId),
    supabase.from('places').select('type').eq('empire_id', empireId),
  ]);

  const rulersCount = assertQuery(
    rulersCountResult as CountQueryResult,
    'ANALYTICS_RULERS_COUNT'
  );
  const placesCount = assertQuery(
    placesCountResult as CountQueryResult,
    'ANALYTICS_PLACES_COUNT'
  );
  const battlesCount = assertQuery(
    battlesCountResult as CountQueryResult,
    'ANALYTICS_BATTLES_COUNT'
  );
  const eventsCount = assertQuery(
    eventsCountResult as CountQueryResult,
    'ANALYTICS_EVENTS_COUNT'
  );
  const provincesCount = assertQuery(
    provincesCountResult as CountQueryResult,
    'ANALYTICS_PROVINCES_COUNT'
  );
  const dynastyRows = assertQuery(dynastyResult, 'ANALYTICS_DYNASTY_FETCH')
    .data as RulerDynastyRow[] | null;
  const categoryRows = assertQuery(categoryResult, 'ANALYTICS_CATEGORY_FETCH')
    .data as EventCategoryRow[] | null;
  const outcomeRows = assertQuery(outcomeResult, 'ANALYTICS_OUTCOME_FETCH')
    .data as BattleOutcomeRow[] | null;
  const eventYears = assertQuery(eventYearsResult, 'ANALYTICS_EVENT_YEARS_FETCH')
    .data as YearRow[] | null;
  const battleYears = assertQuery(
    battleYearsResult,
    'ANALYTICS_BATTLE_YEARS_FETCH'
  ).data as YearRow[] | null;
  const territorialExtentRows = assertQuery(
    territorialExtentResult,
    'ANALYTICS_TERRITORIAL_EXTENT_FETCH'
  ).data as EmpireExtentRow[] | null;
  const placeTypes = assertQuery(placeTypesResult, 'ANALYTICS_PLACE_TYPES_FETCH')
    .data as PlaceTypeRow[] | null;

  return {
    totals: {
      rulers: rulersCount.count ?? 0,
      places: placesCount.count ?? 0,
      battles: battlesCount.count ?? 0,
      events: eventsCount.count ?? 0,
      provinces: provincesCount.count ?? 0,
    },
    dynastyByCounts: buildDynastyCounts(dynastyRows ?? []),
    eventsByCategory: buildCategoryCounts(categoryRows ?? []),
    battleOutcomes: buildOutcomeCounts(outcomeRows ?? []),
    centuryActivity: buildCenturyActivity(eventYears ?? [], battleYears ?? []),
    territorialExtent: buildTerritorialExtent(territorialExtentRows ?? []),
    placesByType: buildPlaceTypeCounts(placeTypes ?? []),
  };
}
