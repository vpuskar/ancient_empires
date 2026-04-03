import { AppError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';
import type {
  TerritorialTimelineData,
  TimelineMarker,
  TimelineSnapshot,
} from '@/lib/types/territorial';

interface EmpireExtentRow {
  year: number;
  area_km2: number;
  geojson_url: string | null;
  notes: string | null;
}

type SnapshotEnrichment = Omit<TimelineSnapshot, 'year' | 'label' | 'areaKm2'>;

function getGenericEnrichment(year: number): SnapshotEnrichment {
  return {
    era: 'Imperial Transition',
    eraDesc:
      'This snapshot has not yet been given a curated narrative, but it still marks a meaningful territorial moment in the empire timeline.',
    eraRange: formatYearLabel(year),
    ruler: null,
    provinces: ['Core Territory'],
    storyTitle: 'Territorial Transition',
    storySummary:
      'The frontier changed at this point in ways that shaped the empire\'s long-term position. Curated narrative details can be added later without changing the data contract.',
  };
}

const ROMAN_SNAPSHOTS: Record<number, SnapshotEnrichment> = {
  [-500]: {
    era: 'Roman Kingdom',
    eraDesc:
      'Rome was still a regional monarchy, consolidating control over Latium through ritual authority, warfare, and urban growth.',
    eraRange: '753 - 509 BC',
    ruler: null,
    provinces: ['Latium', 'Etruria', 'Campania'],
    storyTitle: 'The Eternal City',
    storySummary:
      'At this stage Rome remained compact, but the institutions, roads, and military culture that would support later expansion were taking shape. Its strength lay less in sheer scale than in its ability to absorb neighboring communities into a durable political core.',
  },
  [-200]: {
    era: 'Middle Republic',
    eraDesc:
      'The Republic had become a disciplined Mediterranean power, governed by senatorial consensus and sustained by allied manpower.',
    eraRange: '287 - 133 BC',
    ruler: 'Senate rule',
    provinces: [
      'Italia',
      'Sicilia',
      'Sardinia et Corsica',
      'Hispania Citerior',
      'Hispania Ulterior',
      'Macedonia',
    ],
    storyTitle: 'Masters of the Mediterranean',
    storySummary:
      'Victory in the Punic Wars and campaigns in the Hellenistic east turned Rome from an Italian republic into a naval and imperial power. Territorial control now spanned multiple seas, forcing Rome to govern distant provinces for the first time.',
  },
  [-1]: {
    era: 'Late Republic',
    eraDesc:
      'Rome stood at the hinge between republican collapse and imperial rule, with conquest, civil war, and centralized authority remaking the Mediterranean world.',
    eraRange: '133 BC - 27 BC',
    ruler: null,
    provinces: [
      'Italia',
      'Gallia Narbonensis',
      'Gallia Comata',
      'Hispania Baetica',
      'Hispania Tarraconensis',
      'Africa Proconsularis',
      'Aegyptus',
      'Syria',
    ],
    storyTitle: 'Republic at the Edge',
    storySummary:
      'By 1 BC Rome had already assembled a vast Mediterranean dominion, but its political order remained unsettled after decades of civil war. The territorial footprint of empire existed before the imperial constitution fully did.',
  },
  [100]: {
    era: 'Nerva-Antonine Dynasty',
    eraDesc:
      'Under Trajan, Rome approached its widest extent through disciplined administration, military pressure, and confidence at the center.',
    eraRange: '96 - 192 AD',
    ruler: 'Trajan',
    provinces: [
      'Britannia',
      'Gallia Belgica',
      'Germania Inferior',
      'Germania Superior',
      'Hispania Tarraconensis',
      'Africa Proconsularis',
      'Aegyptus',
      'Arabia Petraea',
      'Dacia',
      'Mesopotamia',
      'Syria',
    ],
    storyTitle: 'Near the Summit',
    storySummary:
      'Around 100 AD the empire was already pressing toward its maximum reach, with Trajan\'s reign opening a final phase of expansion. The map projected unmatched confidence, even as the cost of defending distant borders kept rising.',
  },
  [200]: {
    era: 'Severan Dynasty',
    eraDesc:
      'The Severan emperors preserved imperial scale through military patronage, stronger central authority, and heavier fiscal extraction.',
    eraRange: '193 - 235 AD',
    ruler: 'Septimius Severus',
    provinces: [
      'Britannia',
      'Gallia Lugdunensis',
      'Germania Inferior',
      'Germania Superior',
      'Raetia',
      'Pannonia Superior',
      'Pannonia Inferior',
      'Africa Proconsularis',
      'Aegyptus',
      'Syria',
      'Arabia Petraea',
    ],
    storyTitle: 'Stable Maximum',
    storySummary:
      'Even after Trajan\'s eastern retreat, the empire remained enormous and impressively intact. Severan rule shows Rome at near-maximum scale, but maintaining that scale depended increasingly on army loyalty and relentless revenue.',
  },
  [400]: {
    era: 'Post-Division',
    eraDesc:
      'By the early fifth century the empire was formally divided, with western institutions weakening while the eastern court remained more resilient.',
    eraRange: '395 - 476 AD',
    ruler: 'Honorius (West)',
    provinces: [
      'Italia',
      'Africa Proconsularis',
      'Britannia',
      'Gallia Aquitania',
      'Hispania Baetica',
      'Dalmatia',
      'Thracia',
      'Aegyptus',
      'Syria',
    ],
    storyTitle: 'Twilight of the West',
    storySummary:
      'Roman authority still covered immense territory on paper, but cohesion had begun to fracture. The west struggled to defend and finance its provinces, turning imperial geography into a story of endurance rather than expansion.',
  },
};

const SNAPSHOT_ENRICHMENTS: Record<number, Record<number, SnapshotEnrichment>> = {
  1: ROMAN_SNAPSHOTS,
};

const ROMAN_MARKERS: TimelineMarker[] = [
  { year: -509, label: '509 BC', title: 'Republic Founded' },
  { year: -264, label: '264 BC', title: 'Punic Wars Begin' },
  { year: -44, label: '44 BC', title: 'Caesar Assassinated' },
  { year: -27, label: '27 BC', title: 'Augustus - Empire Begins' },
  { year: 98, label: '98 AD', title: 'Trajan Ascends' },
  { year: 180, label: '180 AD', title: 'Marcus Aurelius Dies' },
  { year: 284, label: '284 AD', title: 'Diocletian - Crisis Ends' },
  { year: 330, label: '330 AD', title: 'Constantinople Founded' },
  { year: 395, label: '395 AD', title: 'Empire Divided' },
  { year: 476, label: '476 AD', title: 'Western Empire Falls' },
];

const TIMELINE_MARKERS: Record<number, TimelineMarker[]> = {
  1: ROMAN_MARKERS,
};

function formatYearLabel(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function enrichSnapshots(
  empireId: number,
  rows: EmpireExtentRow[]
): TimelineSnapshot[] {
  const enrichments = SNAPSHOT_ENRICHMENTS[empireId];

  if (!enrichments) {
    throw new AppError(
      `No territorial enrichment mapping for empire ${empireId}`,
      'TERRITORIAL_ENRICHMENT_MISSING',
      500
    );
  }

  return rows.map((row) => {
    const enrichment = enrichments[row.year];

    if (!enrichment) {
      console.warn(
        `[territorial] Missing snapshot enrichment for empire ${empireId} year ${row.year}; using generic fallback.`
      );
    }

    return {
      year: row.year,
      label: formatYearLabel(row.year),
      areaKm2: row.area_km2,
      ...(enrichment ?? getGenericEnrichment(row.year)),
    };
  });
}

function getMarkers(empireId: number): TimelineMarker[] {
  return TIMELINE_MARKERS[empireId] ?? [];
}

export async function getTerritorialData(
  empireId: number
): Promise<TerritorialTimelineData> {
  const supabase = await createClient();

  const { data: extentRows, error } = await supabase
    .from('empire_extent')
    .select('year, area_km2, geojson_url, notes')
    .eq('empire_id', empireId)
    .order('year');

  if (error) {
    throw new AppError(error.message, 'TERRITORIAL_FETCH', 500);
  }

  if (!extentRows || extentRows.length === 0) {
    throw new AppError(
      `No territorial data for empire ${empireId}`,
      'TERRITORIAL_NO_DATA',
      404
    );
  }

  const snapshots = enrichSnapshots(empireId, extentRows as EmpireExtentRow[]);
  const markers = getMarkers(empireId);
  const maxAreaKm2 = Math.max(...snapshots.map((snapshot) => snapshot.areaKm2));

  return { snapshots, markers, maxAreaKm2 };
}
