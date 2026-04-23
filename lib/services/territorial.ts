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
      "The frontier changed at this point in ways that shaped the empire's long-term position. Curated narrative details can be added later without changing the data contract.",
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
      "Around 100 AD the empire was already pressing toward its maximum reach, with Trajan's reign opening a final phase of expansion. The map projected unmatched confidence, even as the cost of defending distant borders kept rising.",
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
      "Even after Trajan's eastern retreat, the empire remained enormous and impressively intact. Severan rule shows Rome at near-maximum scale, but maintaining that scale depended increasingly on army loyalty and relentless revenue.",
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

const OTTOMAN_SNAPSHOTS: Record<number, SnapshotEnrichment> = {
  1400: {
    era: 'Early Expansion',
    eraDesc:
      "The Ottoman state had expanded deep into the Balkans while consolidating Anatolia, just before the shock of Timur's victory at Ankara reshaped its momentum.",
    eraRange: 'c. 1389 - 1402 AD',
    ruler: 'Bayezid I',
    provinces: [
      'Rumelia',
      'Bulgaria',
      'Macedonia',
      'Thrace',
      'Western Anatolia',
      'Central Anatolia',
    ],
    storyTitle: 'Before the Interregnum',
    storySummary:
      'By 1400 the Ottomans had become a major Balkan and Anatolian power. Their frontier was still flexible, but the dynasty had already built the military and political foundations of an empire that would recover even after the disaster at Ankara.',
  },
  1500: {
    era: 'Post-Constantinople',
    eraDesc:
      'After the conquest of Constantinople in 1453, Ottoman rule centered on a new imperial capital while Bayezid II consolidated the gains of rapid fifteenth-century expansion.',
    eraRange: '1453 - 1512 AD',
    ruler: 'Bayezid II',
    provinces: [
      'Rumelia',
      'Bosnia',
      'Albania',
      'Thrace',
      'Anatolia',
      'Karaman',
      'Constantinople',
    ],
    storyTitle: 'Imperial Consolidation',
    storySummary:
      'The fall of Constantinople transformed the Ottoman polity into a visibly imperial state. By 1500 the priority was not just conquest, but consolidation: binding the Balkans and Anatolia to an increasingly centralized court at Istanbul.',
  },
  1600: {
    era: 'Imperial Zenith',
    eraDesc:
      'The empire stood near its greatest scale after the conquests of the sixteenth century, with authority stretching across the Balkans, Anatolia, the Arab provinces, and North Africa.',
    eraRange: 'c. 1566 - 1617 AD',
    ruler: 'Ahmed I',
    provinces: [
      'Rumelia',
      'Hungary',
      'Anatolia',
      'Syria',
      'Egypt',
      'Iraq',
      'Arabia',
      'Algeria',
    ],
    storyTitle: 'At the Imperial Summit',
    storySummary:
      "Even after Suleiman's reign, the Ottoman world remained one of the largest and most formidable political systems on earth. In 1600, the challenge was not reaching greatness, but governing and defending a realm of continental scale.",
  },
  1700: {
    era: 'Post-Vienna Contraction',
    eraDesc:
      'The failed siege of Vienna and the Treaty of Karlowitz marked a strategic turning point, forcing the empire to adjust to sustained territorial losses in Europe.',
    eraRange: '1683 - 1703 AD',
    ruler: 'Mustafa II',
    provinces: [
      'Rumelia',
      'Thrace',
      'Bosnia',
      'Anatolia',
      'Syria',
      'Egypt',
      'Iraq',
    ],
    storyTitle: 'After Karlowitz',
    storySummary:
      'By 1700 the Ottomans were no longer expanding steadily into Europe. The post-Vienna settlements exposed military and diplomatic limits, inaugurating a century in which recovery, reform, and retrenchment became central themes.',
  },
  1800: {
    era: 'Reform Era',
    eraDesc:
      'Modernization pressures intensified as the empire faced Russian expansion, fiscal strain, and separatist movements, prompting ambitious but contested reform programs.',
    eraRange: '1789 - 1807 AD',
    ruler: 'Selim III',
    provinces: [
      'Rumelia',
      'Anatolia',
      'Syria',
      'Egypt',
      'Iraq',
      'Arabia',
      'Tripolitania',
    ],
    storyTitle: 'Reform Under Pressure',
    storySummary:
      "Around 1800 the Ottoman state still controlled immense territory, but every frontier carried new risks. Selim III's reign illustrates the empire's attempt to modernize institutions quickly enough to survive a far harsher geopolitical age.",
  },
  1900: {
    era: 'Final Decades',
    eraDesc:
      'The late empire struggled to preserve cohesion as European intervention, nationalist revolt, and administrative strain fed the image of the Ottomans as the "Sick Man of Europe."',
    eraRange: '1876 - 1909 AD',
    ruler: 'Abdulhamid II',
    provinces: [
      'Anatolia',
      'Thrace',
      'Syria',
      'Iraq',
      'Arabia',
      'Palestine',
      'Hejaz',
    ],
    storyTitle: 'Holding the Center',
    storySummary:
      'By 1900 the empire had lost much of its former European and North African reach, yet it remained a major state spanning key routes between Europe, Asia, and the Arab world. Its final decades were defined by preservation, centralization, and mounting crisis.',
  },
};

const JAPANESE_SNAPSHOTS: Record<number, SnapshotEnrichment> = {
  800: {
    era: 'Nara / Early Heian Period',
    eraDesc:
      'The Yamato state consolidates its bureaucratic order under the ritsuryo system, with imperial authority extending across Honshu, Shikoku, and northern Kyushu.',
    eraRange: 'c. 794 - 900 AD',
    ruler: 'Emperor Kanmu',
    provinces: ['Yamashiro', 'Yamato', 'Musashi', 'Settsu', 'Mutsu'],
    storyTitle: 'Court and Frontier',
    storySummary:
      'The court governs from Heian-kyo, established in 794. Imperial authority extends across Honshu, Shikoku, and northern Kyushu, while campaigns against the Emishi push the frontier further into Tohoku. Hokkaido and the Ryukyu islands remain outside imperial administration.',
  },
  1200: {
    era: 'Kamakura Shogunate',
    eraDesc:
      'Japan operates under dual authority: the emperor at Kyoto and the Kamakura shogunate in eastern Japan.',
    eraRange: '1185 - 1333 AD',
    ruler: 'Minamoto no Yoritomo',
    provinces: ['Yamashiro', 'Sagami', 'Mutsu', 'Chikuzen', 'Echigo'],
    storyTitle: 'Warrior Government',
    storySummary:
      'Warrior government controls all four main islands. The Northern Fujiwara have been crushed. Zen Buddhism and samurai culture are reshaping Japanese society from the east. The Mongol threat has not yet materialized.',
  },
  1600: {
    era: 'Sekigahara - Tokugawa Unification',
    eraDesc:
      "Tokugawa Ieyasu's victory at Sekigahara ends a century of civil war and unifies the archipelago under a single political authority.",
    eraRange: '1600 - 1603 AD',
    ruler: 'Tokugawa Ieyasu',
    provinces: ['Musashi', 'Mikawa', 'Owari', 'Satsuma', 'Chikuzen'],
    storyTitle: 'A New Peace',
    storySummary:
      'The entire main island chain - Honshu, Kyushu, Shikoku, and the Hokkaido frontier - is brought under Tokugawa hegemony. A new era of enforced peace begins.',
  },
  1800: {
    era: 'Mid-Edo Period',
    eraDesc:
      'Two centuries of Tokugawa peace have produced a stable, prosperous, and largely isolated Japan.',
    eraRange: '1603 - 1868 AD',
    ruler: 'Emperor Kokaku',
    provinces: ['Musashi', 'Yamashiro', 'Satsuma', 'Echigo', 'Ezo'],
    storyTitle: 'Peace Under Pressure',
    storySummary:
      'All four main islands are integrated under shogunal administration. Northern Hokkaido is increasingly under direct control as Russian ships probe the northern frontier. Urban merchant culture flourishes alongside declining shogunal finances.',
  },
  1900: {
    era: 'Meiji Imperial Expansion',
    eraDesc:
      'Victory in the First Sino-Japanese War (1894-95) delivers Taiwan and the Pescadores to Japan, marking the beginning of overseas colonial expansion.',
    eraRange: '1868 - 1912 AD',
    ruler: 'Emperor Meiji',
    provinces: ['Musashi', 'Yamashiro', 'Satsuma', 'Chikuzen', 'Hizen'],
    storyTitle: 'Modern Imperial Power',
    storySummary:
      'Industrial modernization, a conscript army, and a modern navy have transformed Japan within a single generation. The nation is now recognized as a significant regional power, with Korea firmly within its sphere of influence.',
  },
  1938: {
    era: 'Empire of Japan - Continental Peak',
    eraDesc:
      'The Empire of Japan reaches its greatest continental extent through formal colonies, leased territories, mandates, client states, and occupied coastal China.',
    eraRange: '1910 - 1945 AD',
    ruler: 'Emperor Showa (Hirohito)',
    provinces: ['Musashi', 'Yamashiro', 'Chikuzen', 'Hizen', 'Satsuma'],
    storyTitle: 'Continental Peak',
    storySummary:
      'Korea, Taiwan, Karafuto, the Kwantung Leased Territory, Manchukuo, Pacific mandate islands, and occupied coastal China are under Japanese control or direct influence. Full expansion into Southeast Asia and the Pacific War against the United States remain three years away.',
const CHINESE_SNAPSHOTS: Record<number, SnapshotEnrichment> = {
  [-1]: {
    era: 'Han Dynasty (Peak)',
    eraDesc:
      'The Han Dynasty at its zenith. The Silk Road flourishes, connecting China to distant lands. Military expansion into Central Asia, Korea, and Vietnam defines an era of unprecedented reach.',
    eraRange: '206 BC - 9 AD',
    ruler: 'Emperor Wu of Han',
    provinces: [
      'Han heartland',
      'Korean protectorates',
      'Central Asian routes',
      'Northern Vietnam',
    ],
    storyTitle: 'The Silk Road Empire',
    storySummary:
      "At its peak the Han Dynasty rivalled Rome in scale and sophistication. Caravans linked Chang'an to Persia; armies pushed into the steppes. This was the moment China first defined itself as a world power.",
  },
  [500]: {
    era: 'Period of Division',
    eraDesc:
      'China fractured after the Han collapse. The Toba Wei dominate the north; Han Chinese dynasties rule the south. Buddhism spreads rapidly, leaving extraordinary cave art at Dunhuang and Longmen.',
    eraRange: '220 - 589 AD',
    ruler: 'Multiple — Northern Wei / Southern Dynasties',
    provinces: [
      'Northern Wei',
      'Eastern Jin successor states',
      'Southern dynasties',
    ],
    storyTitle: 'A Divided Land',
    storySummary:
      'For nearly four centuries China had no single ruler. Yet this fragmentation was also a period of profound cultural transformation — Buddhism took root, new art forms emerged, and the groundwork for Tang greatness was laid.',
  },
  [700]: {
    era: 'Tang Dynasty (Golden Age)',
    eraDesc:
      "Tang China is the world's most cosmopolitan civilization. Chang'an, the capital, is the world's largest city. Poetry, painting, and Buddhism flourish.",
    eraRange: '618 - 907 AD',
    ruler: 'Emperor Xuanzong',
    provinces: [
      'Core Tang domains',
      'Protectorates in Central Asia',
      'Tibet borderlands',
      'Korean influence',
    ],
    storyTitle: "The World's Capital",
    storySummary:
      "Chang'an in 700 AD was home to over a million people and merchants from dozens of nations. Tang poets defined Chinese literature for all time. The empire stretched further west than any Chinese dynasty before or since.",
  },
  [1100]: {
    era: 'Northern Song Dynasty',
    eraDesc:
      'Despite losing the north to the Jurchen Jin, Song China undergoes an economic revolution. Gunpowder weapons, movable type printing, and paper money transform society.',
    eraRange: '960 - 1127 AD',
    ruler: 'Song Emperors',
    provinces: [
      'Song Empire (central and south)',
      'Jin Dynasty (north)',
      'Liao remnants',
    ],
    storyTitle: 'Revolution Without Conquest',
    storySummary:
      "The Song never matched Tang territorial scale, but no dynasty was more innovative. Paper money, printing, and explosive weapons all emerged here. China's economy became the largest in the world.",
  },
  [1500]: {
    era: 'Ming Dynasty',
    eraDesc:
      "The Ming have restored Han Chinese rule and built the Forbidden City. Zheng He's fleets reach East Africa. The Great Wall is rebuilt to its most famous form.",
    eraRange: '1368 - 1644 AD',
    ruler: 'Yongle / Xuande Era',
    provinces: [
      'Ming heartland',
      'Northern frontier (Great Wall)',
      'Maritime tributary network',
      'Southwest borderlands',
    ],
    storyTitle: 'The Dragon Throne',
    storySummary:
      "The Forbidden City stood complete; the Great Wall gleamed new. Zheng He's treasure fleets dwarfed anything Europe could muster. The Ming represented Han Chinese civilization at its most confident and self-assured.",
  },
  [1800]: {
    era: 'Qing Dynasty (Zenith)',
    eraDesc:
      'The Qing at maximum territorial extent. Tibet, Xinjiang, Mongolia, and Manchuria all under Qing control. Internal prosperity masks growing Western pressure.',
    eraRange: '1735 - 1796 AD',
    ruler: 'Qianlong Emperor (legacy period)',
    provinces: [
      'Qing proper',
      'Tibet',
      'Xinjiang',
      'Outer Mongolia',
      'Manchuria',
    ],
    storyTitle: 'The Last Summit',
    storySummary:
      'Under Qianlong the Qing Empire reached its greatest extent — larger than any previous Chinese dynasty. But as the emperor celebrated, the first Western ships carrying new demands were already rounding the Cape.',
  },
};

const SNAPSHOT_ENRICHMENTS: Record<
  number,
  Record<number, SnapshotEnrichment>
> = {
  1: ROMAN_SNAPSHOTS,
  3: JAPANESE_SNAPSHOTS,
  2: CHINESE_SNAPSHOTS,
  4: OTTOMAN_SNAPSHOTS,
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
  3: [
    {
      year: -660,
      label: '660 BC',
      title: 'Traditional founding of imperial line',
    },
    { year: 587, label: '587 AD', title: 'Soga victory - Buddhism secured' },
    { year: 645, label: '645 AD', title: 'Taika Reforms' },
    { year: 710, label: '710 AD', title: 'Capital established at Nara' },
    { year: 794, label: '794 AD', title: 'Capital moved to Heian-kyo' },
    { year: 1185, label: '1185 AD', title: 'Kamakura shogunate begins' },
    { year: 1333, label: '1333 AD', title: 'Kemmu Restoration' },
    { year: 1600, label: '1600 AD', title: 'Battle of Sekigahara' },
    { year: 1868, label: '1868 AD', title: 'Meiji Restoration' },
    { year: 1945, label: '1945 AD', title: 'End of the Japanese Empire' },
  2: [
    { year: -221, label: '221 BC', title: 'Qin Unifies China' },
    { year: -206, label: '206 BC', title: 'Han Dynasty Founded' },
    { year: -141, label: '141 BC', title: 'Emperor Wu Ascends' },
    { year: 220, label: '220 AD', title: 'Han Dynasty Falls' },
    { year: 618, label: '618 AD', title: 'Tang Dynasty Founded' },
    { year: 755, label: '755 AD', title: 'An Lushan Rebellion' },
    { year: 1271, label: '1271 AD', title: 'Yuan Dynasty (Kublai Khan)' },
    { year: 1368, label: '1368 AD', title: 'Ming Dynasty Founded' },
    { year: 1644, label: '1644 AD', title: 'Qing Dynasty Founded' },
    { year: 1912, label: '1912 AD', title: 'Empire Ends' },
  ],
  4: [
    { year: 1402, label: '1402 AD', title: 'Battle of Ankara' },
    { year: 1453, label: '1453 AD', title: 'Constantinople Falls' },
    { year: 1517, label: '1517 AD', title: 'Mamluk Sultanate Conquered' },
    { year: 1566, label: '1566 AD', title: 'Death of Suleiman I' },
    { year: 1683, label: '1683 AD', title: 'Second Siege of Vienna Fails' },
    { year: 1699, label: '1699 AD', title: 'Treaty of Karlowitz' },
    { year: 1789, label: '1789 AD', title: 'Selim III Begins Reforms' },
    { year: 1876, label: '1876 AD', title: 'Abdulhamid II Ascends' },
    { year: 1908, label: '1908 AD', title: 'Young Turk Revolution' },
    { year: 1922, label: '1922 AD', title: 'Sultanate Abolished' },
  ],
};

function formatYearLabel(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function enrichSnapshots(
  empireId: number,
  rows: EmpireExtentRow[]
): TimelineSnapshot[] {
  const enrichments = SNAPSHOT_ENRICHMENTS[empireId];

  return rows.map((row) => {
    const enrichment = enrichments?.[row.year];

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
