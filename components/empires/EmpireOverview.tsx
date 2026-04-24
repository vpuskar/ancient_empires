'use client';

import { useState, useEffect, useRef } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { EmpireStats } from '@/lib/services/stats';

/* ================================================================
   TYPES
   ================================================================ */
interface Stat {
  label: string;
  value: string;
  unit: string;
}
interface Ruler {
  name: string;
  reign: string;
  title: string;
  desc: string;
  color: string;
}
interface TimelineEvent {
  year: string;
  label: string;
  era: string;
  pos: number;
}
interface ChapterPreview {
  num: string;
  title: string;
  era: string;
  teaser: string;
}
interface MapProvince {
  name: string;
  d: string;
  primary?: boolean;
}
interface MapConfig {
  viewBox: string;
  caption: string;
  capitalA: { cx: number; cy: number; label: string };
  capitalB?: { cx: number; cy: number; label: string };
  provinces: MapProvince[];
}
interface EmpireContent {
  hook: string;
  stats?: Stat[];
  rulers: Ruler[];
  timeline: TimelineEvent[];
  chapters: ChapterPreview[];
  map: MapConfig;
  closingQuote: string;
}

/* ================================================================
   CONTENT — keyed by slug (Phase 2+: from Supabase)
   ================================================================ */
const CONTENT: Record<string, EmpireContent> = {
  roman: {
    hook: 'From a cluster of huts on the Palatine Hill to an empire spanning three continents, Rome transformed the ancient world. Its roads, laws, language, and idea of civilisation became the bedrock of Western culture \u2014 an influence still felt in every courtroom, cathedral, and capitol building on Earth.',
    stats: [
      { label: 'Duration', value: '1229', unit: 'years' },
      { label: 'Peak Population', value: '70M', unit: 'people' },
      { label: 'Peak Territory', value: '5M', unit: 'km\u00B2' },
      { label: 'Capitals', value: 'Rome', unit: '& Constantinople' },
      { label: 'Rulers', value: '170+', unit: 'emperors' },
      { label: 'Peak Extent', value: '117', unit: 'AD' },
    ],
    rulers: [
      {
        name: 'Augustus',
        reign: '27 BC \u2013 14 AD',
        title: 'First Emperor',
        desc: 'Transformed the Republic into an Empire and inaugurated two centuries of peace.',
        color: '#C9A84C',
      },
      {
        name: 'Julius Caesar',
        reign: '49 \u2013 44 BC',
        title: 'Dictator Perpetuo',
        desc: 'Conquered Gaul, crossed the Rubicon, and remade Rome before his assassination.',
        color: '#8B0000',
      },
      {
        name: 'Trajan',
        reign: '98 \u2013 117 AD',
        title: 'Optimus Princeps',
        desc: 'Expanded Rome to its greatest territorial extent, from Britain to Mesopotamia.',
        color: '#C9A84C',
      },
      {
        name: 'Marcus Aurelius',
        reign: '161 \u2013 180 AD',
        title: 'Philosopher Emperor',
        desc: 'The last of the Five Good Emperors, who wrote Meditations on campaign.',
        color: '#6B7B3A',
      },
      {
        name: 'Constantine I',
        reign: '306 \u2013 337 AD',
        title: 'The Great',
        desc: 'Reunited the Empire, founded Constantinople, and embraced Christianity.',
        color: '#7B6B8A',
      },
    ],
    timeline: [
      { year: '753 BC', label: 'Founding of Rome', era: 'Kingdom', pos: 0 },
      {
        year: '509 BC',
        label: 'Republic established',
        era: 'Republic',
        pos: 14,
      },
      { year: '264 BC', label: 'First Punic War', era: 'Republic', pos: 26 },
      {
        year: '44 BC',
        label: 'Caesar assassinated',
        era: 'Late Republic',
        pos: 42,
      },
      {
        year: '27 BC',
        label: 'Augustus \u2014 Empire begins',
        era: 'Principate',
        pos: 46,
      },
      {
        year: '117 AD',
        label: 'Peak territorial extent',
        era: 'Principate',
        pos: 56,
      },
      {
        year: '285 AD',
        label: "Diocletian's reforms",
        era: 'Dominate',
        pos: 70,
      },
      {
        year: '330 AD',
        label: 'Constantinople founded',
        era: 'Dominate',
        pos: 74,
      },
      { year: '395 AD', label: 'Empire divided', era: 'Late Empire', pos: 80 },
      {
        year: '476 AD',
        label: 'Fall of Western Rome',
        era: 'Late Empire',
        pos: 90,
      },
    ],
    chapters: [
      {
        num: 'I',
        title: 'The Founding of Rome',
        era: '753 \u2013 509 BC',
        teaser:
          'Seven hills, a she-wolf, and the birth of a city destined to command the world.',
      },
      {
        num: 'II',
        title: 'Rise of the Republic',
        era: '509 \u2013 264 BC',
        teaser:
          'Two consuls, a defiant Senate, and the slow conquest of the Italian peninsula.',
      },
      {
        num: 'III',
        title: 'The Punic Wars',
        era: '264 \u2013 146 BC',
        teaser:
          "Hannibal's elephants, Scipio's genius, and the destruction of Carthage.",
      },
      {
        num: 'IV',
        title: 'Fall of the Republic',
        era: '133 \u2013 27 BC',
        teaser:
          "Caesar, the Rubicon, and the violent end of Rome's great experiment.",
      },
      {
        num: 'V',
        title: 'The Pax Romana',
        era: '27 BC \u2013 180 AD',
        teaser:
          'Two centuries of peace under emperors who found Rome brick and left it marble.',
      },
      {
        num: 'VI',
        title: 'Crisis & Transformation',
        era: '235 \u2013 337 AD',
        teaser:
          'Fifty emperors in fifty years, then Constantine and a new faith.',
      },
      {
        num: 'VII',
        title: 'The Fall of the West',
        era: '395 \u2013 476 AD',
        teaser:
          'The slow twilight \u2014 barbarian migrations and the last boy-emperor.',
      },
    ],
    map: {
      viewBox: '170 55 290 205',
      caption:
        'Under Trajan in 117 AD, Rome controlled the entire Mediterranean basin, from Britannia to Mesopotamia \u2014 roughly 5 million km\u00B2.',
      capitalA: { cx: 287, cy: 162, label: 'Rome' },
      capitalB: { cx: 348, cy: 152, label: 'Constantinople' },
      provinces: [
        {
          name: 'Italia',
          d: 'M280,155 L290,140 L305,145 L310,160 L305,180 L295,195 L285,185 L275,170 Z',
          primary: true,
        },
        {
          name: 'Hispania',
          d: 'M190,150 L220,135 L240,145 L245,165 L235,185 L210,190 L195,180 L185,165 Z',
        },
        {
          name: 'Gallia',
          d: 'M220,110 L260,100 L275,115 L280,140 L260,145 L235,140 L215,130 Z',
        },
        {
          name: 'Britannia',
          d: 'M215,70 L235,65 L240,80 L235,95 L220,95 L210,85 Z',
        },
        {
          name: 'Africa',
          d: 'M220,195 L260,190 L300,195 L330,200 L340,210 L310,215 L260,210 L225,205 Z',
        },
        {
          name: 'Aegyptus',
          d: 'M350,200 L365,195 L370,215 L375,240 L365,245 L355,230 L345,215 Z',
        },
        {
          name: 'Graecia',
          d: 'M320,155 L335,148 L340,160 L335,175 L325,180 L315,170 Z',
        },
        {
          name: 'Asia Minor',
          d: 'M345,140 L385,130 L400,140 L395,160 L375,168 L350,165 L340,155 Z',
        },
        {
          name: 'Syria',
          d: 'M395,160 L410,155 L415,175 L405,190 L390,185 L385,170 Z',
        },
        {
          name: 'Dacia',
          d: 'M310,120 L335,115 L345,130 L340,145 L320,148 L305,140 Z',
        },
        {
          name: 'Germania',
          d: 'M260,85 L290,78 L300,95 L295,115 L275,120 L255,110 Z',
        },
        {
          name: 'Mesopotamia',
          d: 'M410,150 L430,145 L440,160 L435,178 L415,175 L405,165 Z',
        },
      ],
    },
    closingQuote:
      'All roads lead to Rome \u2014 and every road begins with a single step.',
  },
  chinese: {
    hook: "From the first unification under Qin Shi Huang in 221 BC to the fall of the Qing Dynasty in 1912, Chinese imperial history spans over two millennia of dynastic rise and fall. This is the story of the world's longest continuous political tradition \u2014 shaped by Confucian philosophy, technological innovation, and the rhythms of the Mandate of Heaven.",
    rulers: [
      {
        name: 'Qin Shi Huang',
        reign: '221 \u2013 210 BC',
        title: 'First Emperor',
        desc: 'United the Warring States, standardized script and measures, and began the first imperial order in China.',
        color: '#DE2910',
      },
      {
        name: 'Emperor Wu of Han',
        reign: '141 \u2013 87 BC',
        title: 'Han Expansionist',
        desc: 'Extended Han power deep into Inner Asia, opened the Silk Road, and elevated Confucian statecraft.',
        color: '#C9A84C',
      },
      {
        name: 'Wu Zetian',
        reign: '690 \u2013 705 AD',
        title: 'Only Woman Emperor',
        desc: 'Ruled in her own name, strengthened the examination system, and presided over a confident Tang court.',
        color: '#7B6B8A',
      },
      {
        name: 'Kangxi Emperor',
        reign: '1661 \u2013 1722 AD',
        title: 'Qing Consolidator',
        desc: 'Stabilized the Qing dynasty, expanded imperial frontiers, and sponsored scholarship on a vast scale.',
        color: '#3E4E88',
      },
      {
        name: 'Qianlong Emperor',
        reign: '1735 \u2013 1796 AD',
        title: 'High Qing Zenith',
        desc: 'Oversaw the empire at its greatest territorial extent while projecting courtly grandeur and cultural confidence.',
        color: '#6B7B3A',
      },
    ],
    timeline: [
      {
        year: '221 BC',
        label: 'Qin unification of China',
        era: 'Qin',
        pos: 0,
      },
      {
        year: '141 BC',
        label: 'Emperor Wu of Han begins his reign',
        era: 'Han',
        pos: 12,
      },
      {
        year: '618 AD',
        label: 'Tang dynasty founded',
        era: 'Tang',
        pos: 34,
      },
      {
        year: '960 AD',
        label: 'Song dynasty begins',
        era: 'Song',
        pos: 48,
      },
      {
        year: '1271 AD',
        label: 'Kublai Khan proclaims the Yuan',
        era: 'Yuan',
        pos: 62,
      },
      {
        year: '1368 AD',
        label: 'Ming dynasty established',
        era: 'Ming',
        pos: 70,
      },
      {
        year: '1644 AD',
        label: 'Qing enters Beijing',
        era: 'Qing',
        pos: 80,
      },
      {
        year: '1796 AD',
        label: 'End of the Qianlong era',
        era: 'High Qing',
        pos: 88,
      },
      {
        year: '1912 AD',
        label: 'Last emperor abdicates',
        era: 'End of Empire',
        pos: 90,
      },
    ],
    chapters: [
      {
        num: 'I',
        title: 'Qin Unification',
        era: '221 \u2013 206 BC',
        teaser:
          'The first empire welded rival states into one realm through law, roads, walls, and a shared written order.',
      },
      {
        num: 'II',
        title: 'The Han World',
        era: '206 BC \u2013 220 AD',
        teaser:
          'Silk Road exchange, Confucian governance, and early imperial institutions gave Chinese rule enduring form.',
      },
      {
        num: 'III',
        title: 'The Tang Golden Age',
        era: '618 \u2013 907 AD',
        teaser:
          "Chang'an became the cosmopolitan center of a dynasty famed for poetry, Buddhism, and aristocratic brilliance.",
      },
      {
        num: 'IV',
        title: 'Song Innovation',
        era: '960 \u2013 1279 AD',
        teaser:
          'Commerce, cities, gunpowder, printing, and paper money transformed the empire into a powerhouse of invention.',
      },
      {
        num: 'V',
        title: 'Under the Yuan',
        era: '1271 \u2013 1368 AD',
        teaser:
          'Kublai Khan ruled China from a Mongol court that linked East Asia to the wider Eurasian world.',
      },
      {
        num: 'VI',
        title: 'Ming Restoration',
        era: '1368 \u2013 1644 AD',
        teaser:
          'The Forbidden City, Zheng He voyages, and rebuilt frontier defenses marked a confident return of native rule.',
      },
      {
        num: 'VII',
        title: 'The Qing Century and Crisis',
        era: '1644 \u2013 1912 AD',
        teaser:
          'High Qing prosperity gave way to rebellion, foreign pressure, and the final collapse of the dynastic order.',
      },
    ],
    map: {
      viewBox: '170 55 290 205',
      caption:
        'At its Qing height, imperial China stretched from Manchuria to Xinjiang and from the Mongolian steppe to the South China coast under a single dynastic state.',
      capitalA: { cx: 392, cy: 118, label: "Chang'an" },
      capitalB: { cx: 430, cy: 98, label: 'Beijing' },
      provinces: [
        {
          name: 'North China Plain',
          d: 'M378,106 L420,96 L446,108 L448,132 L420,144 L384,138 L370,122 Z',
          primary: true,
        },
        {
          name: 'Guanzhong',
          d: 'M350,116 L378,108 L390,122 L380,142 L352,140 L340,128 Z',
          primary: true,
        },
        {
          name: 'Manchuria',
          d: 'M422,76 L458,68 L482,82 L476,106 L446,112 L420,98 Z',
        },
        {
          name: 'Mongolia',
          d: 'M350,82 L414,72 L438,86 L430,102 L390,110 L352,100 L338,90 Z',
        },
        {
          name: 'Xinjiang',
          d: 'M238,100 L302,90 L336,102 L324,126 L274,132 L232,118 Z',
        },
        {
          name: 'Tibet',
          d: 'M274,130 L334,122 L356,142 L340,164 L290,166 L262,148 Z',
        },
        {
          name: 'Sichuan',
          d: 'M328,138 L360,132 L378,146 L370,170 L338,176 L318,160 Z',
        },
        {
          name: 'Yangtze Valley',
          d: 'M360,142 L414,136 L438,150 L432,176 L396,184 L364,176 Z',
        },
        {
          name: 'South China',
          d: 'M350,176 L408,180 L428,196 L414,224 L370,228 L340,206 Z',
        },
      ],
    },
    closingQuote:
      'Dynasties rose and fell, but the imperial idea endured through ritual, learning, and the conviction that order under Heaven could be renewed.',
  },
  japanese: {
    hook: 'Japanese imperial history traces an unbroken dynastic line across more than two millennia — from the legendary founding of the Yamato state to the industrial modernity of the Meiji era and the catastrophic expansion of the twentieth century. No other monarchy in world history has maintained continuous dynastic legitimacy for so long. Across this vast span Japan absorbed continental civilization from China and Korea, developed its own distinctive literary and aesthetic traditions, endured centuries of warrior government under successive shogunates, and then remade itself with astonishing speed into a modern industrial power. The Japanese imperial story is one of remarkable cultural continuity threaded through profound political transformation.',
    rulers: [
      {
        name: 'Emperor Meiji',
        reign: '1867 – 1912',
        title: 'Modernizing Emperor',
        desc: "Presided over Japan's transformation from feudal isolation to modern industrial great power within a single generation.",
        color: '#BC002D',
      },
      {
        name: 'Tokugawa Ieyasu',
        reign: '1600 – 1616',
        title: 'Founding Shogun',
        desc: 'Won the Battle of Sekigahara and built institutional foundations that kept Japan at peace for 250 years.',
        color: '#C9A84C',
      },
      {
        name: 'Empress Suiko',
        reign: '593 – 628',
        title: 'First Empress Regnant',
        desc: "Japan's first empress regnant who governed alongside Prince Shotoku, transforming the court through Buddhism and continental statecraft.",
        color: '#7B6B8A',
      },
      {
        name: 'Emperor Kanmu',
        reign: '781 – 806',
        title: 'Founder of Heian-kyo',
        desc: 'Founded the city of Kyoto, shaping Japanese political geography for over a millennium.',
        color: '#6B7B3A',
      },
      {
        name: 'Emperor Go-Daigo',
        reign: '1318 – 1339',
        title: 'Restoration Claimant',
        desc: 'Overthrew the Kamakura shogunate in the Kemmu Restoration, briefly restoring direct imperial rule before going into defiant exile.',
        color: '#3E4E88',
      },
    ],
    timeline: [
      {
        year: 'c. 300 AD',
        label: 'Yamato state begins to consolidate',
        era: 'Yamato',
        pos: 0,
      },
      {
        year: '552 AD',
        label: 'Buddhism arrives from Baekje',
        era: 'Asuka',
        pos: 14,
      },
      {
        year: '645 AD',
        label: 'Taika Reforms launched',
        era: 'Asuka',
        pos: 22,
      },
      {
        year: '710 AD',
        label: 'Nara becomes first permanent capital',
        era: 'Nara',
        pos: 30,
      },
      {
        year: '794 AD',
        label: 'Heian-kyo founded',
        era: 'Heian',
        pos: 38,
      },
      {
        year: '1192 AD',
        label: 'Kamakura shogunate established',
        era: 'Kamakura',
        pos: 52,
      },
      {
        year: '1600 AD',
        label: 'Sekigahara clears path to Tokugawa rule',
        era: 'Unification',
        pos: 68,
      },
      {
        year: '1868 AD',
        label: 'Meiji Restoration begins',
        era: 'Modern Empire',
        pos: 82,
      },
      {
        year: '1945 AD',
        label: 'Imperial expansion ends with surrender',
        era: 'End of Empire',
        pos: 90,
      },
    ],
    chapters: [
      {
        num: 'I',
        title: 'Yamato and Asuka Period',
        era: 'c. 300 – 710 AD',
        teaser:
          'The Yamato court absorbed Buddhism, writing, and statecraft from the continent while building the first centralized imperial order.',
      },
      {
        num: 'II',
        title: 'Nara and Heian Period',
        era: '710 – 1185 AD',
        teaser:
          'Courtly refinement flowered at Nara and Kyoto as Fujiwara influence, cloistered rule, and rising warrior clans reshaped power.',
      },
      {
        num: 'III',
        title: 'Kamakura and Muromachi Shogunates',
        era: '1185 – 1573 AD',
        teaser:
          'Warrior governments ruled beside the throne, repelled Mongol invasions, and presided over cultural brilliance before Sengoku fragmentation.',
      },
      {
        num: 'IV',
        title: 'Unification and Edo Period',
        era: '1573 – 1868 AD',
        teaser:
          'Nobunaga, Hideyoshi, and Ieyasu reunited the realm before Tokugawa peace fostered cities, commerce, kabuki, ukiyo-e, and haiku.',
      },
      {
        num: 'V',
        title: 'Meiji Restoration and Modern Empire',
        era: '1868 – 1945 AD',
        teaser:
          'Japan industrialized with startling speed, rose as a great power, and then drove its empire into catastrophic war and defeat.',
      },
    ],
    map: {
      viewBox: '170 55 290 205',
      caption:
        'At its modern imperial height, Japan combined the home islands with overseas possessions, but its political and cultural core remained anchored in Honshu and the capital at Tokyo.',
      capitalA: { cx: 432, cy: 152, label: 'Tokyo' },
      provinces: [
        {
          name: 'Hokkaido',
          d: 'M424,88 L448,80 L466,90 L460,108 L438,114 L420,102 Z',
        },
        {
          name: 'Tohoku',
          d: 'M418,116 L438,110 L448,126 L444,144 L426,148 L414,134 Z',
        },
        {
          name: 'Kanto',
          d: 'M428,144 L446,140 L454,152 L448,166 L432,168 L422,156 Z',
          primary: true,
        },
        {
          name: 'Kansai',
          d: 'M402,150 L420,146 L428,156 L422,168 L406,170 L396,160 Z',
          primary: true,
        },
        {
          name: 'Chugoku',
          d: 'M378,152 L402,148 L408,160 L398,170 L378,168 L370,160 Z',
        },
        {
          name: 'Shikoku',
          d: 'M394,174 L410,172 L414,180 L404,188 L392,186 Z',
        },
        {
          name: 'Kyushu',
          d: 'M356,166 L378,160 L388,172 L380,190 L360,192 L348,178 Z',
        },
      ],
    },
    closingQuote:
      'Across centuries of court ritual, warrior rule, and industrial transformation, imperial Japan remade its institutions without surrendering the prestige of the throne.',
  },
  ottoman: {
    hook: "From a frontier beylik in northwestern Anatolia to a transcontinental empire spanning the Balkans, the Arab provinces, and the eastern Mediterranean, the Ottoman state fused conquest, law, faith, and commerce into one of the early modern world's most durable imperial systems.",
    rulers: [
      {
        name: 'Osman I',
        reign: 'c. 1299 \u2013 1324 AD',
        title: 'Dynasty Founder',
        desc: 'Forged a small frontier principality into the nucleus of a dynasty that would endure for more than six centuries.',
        color: '#6B4F2A',
      },
      {
        name: 'Mehmed II',
        reign: '1451 \u2013 1481 AD',
        title: 'Conqueror of Constantinople',
        desc: 'Seized Constantinople in 1453 and transformed it into Istanbul, the imperial heart of Ottoman power.',
        color: '#1A6B3A',
      },
      {
        name: 'Selim I',
        reign: '1512 \u2013 1520 AD',
        title: 'Empire Doubler',
        desc: 'Overwhelmed the Mamluk Sultanate and brought Syria, Egypt, and the holy cities under Ottoman rule.',
        color: '#5B1F1F',
      },
      {
        name: 'Suleiman I',
        reign: '1520 \u2013 1566 AD',
        title: 'The Lawgiver',
        desc: 'Led the empire to its zenith through campaigns, legal reform, architecture, and courtly magnificence.',
        color: '#C9A227',
      },
      {
        name: 'Abdulhamid II',
        reign: '1876 \u2013 1909 AD',
        title: 'Sultan in the Final Decades',
        desc: "Ruled during an age of reform, railways, surveillance, and mounting pressure on the empire's remaining frontiers.",
        color: '#3E4E88',
      },
    ],
    timeline: [
      {
        year: '1299 AD',
        label: 'Ottoman dynasty emerges in Bithynia',
        era: 'Frontier Beylik',
        pos: 0,
      },
      {
        year: '1362 AD',
        label: 'Murad I takes Adrianople',
        era: 'Balkan Expansion',
        pos: 12,
      },
      {
        year: '1402 AD',
        label: 'Defeat at Ankara',
        era: 'Interregnum',
        pos: 22,
      },
      {
        year: '1453 AD',
        label: 'Constantinople falls',
        era: 'Imperial Capital',
        pos: 34,
      },
      {
        year: '1517 AD',
        label: 'Mamluk Sultanate annexed',
        era: 'Middle Eastern Expansion',
        pos: 46,
      },
      {
        year: '1566 AD',
        label: 'Death of Suleiman I',
        era: 'Imperial Zenith',
        pos: 58,
      },
      {
        year: '1699 AD',
        label: 'Treaty of Karlowitz',
        era: 'Territorial Retrenchment',
        pos: 70,
      },
      {
        year: '1839 AD',
        label: 'Tanzimat reforms begin',
        era: 'Reform Era',
        pos: 82,
      },
      {
        year: '1908 AD',
        label: 'Young Turk Revolution',
        era: 'Constitutional Crisis',
        pos: 90,
      },
    ],
    chapters: [
      {
        num: 'I',
        title: 'From Frontier March to Dynasty',
        era: '1299 \u2013 1362 AD',
        teaser:
          'Osman and Orhan built a frontier polity whose flexibility made expansion possible.',
      },
      {
        num: 'II',
        title: 'Across the Straits',
        era: '1362 \u2013 1402 AD',
        teaser:
          'The Ottomans crossed decisively into Europe and reshaped the balance of power in the Balkans.',
      },
      {
        num: 'III',
        title: 'Interregnum and Recovery',
        era: '1402 \u2013 1451 AD',
        teaser:
          'After Ankara, the dynasty nearly fractured before rebuilding its authority.',
      },
      {
        num: 'IV',
        title: "The Conqueror's City",
        era: '1451 \u2013 1481 AD',
        teaser:
          'Mehmed II made Constantinople the new imperial center of an Ottoman world.',
      },
      {
        num: 'V',
        title: 'Empire of Three Continents',
        era: '1512 \u2013 1566 AD',
        teaser:
          'Selim and Suleiman carried Ottoman rule from Hungary to Yemen and from Algiers to Iraq.',
      },
      {
        num: 'VI',
        title: 'Power, Reform, and Retrenchment',
        era: '1566 \u2013 1792 AD',
        teaser:
          "Court politics, military change, and great-power rivalry tested the empire's resilience.",
      },
      {
        num: 'VII',
        title: 'Tanzimat to the End',
        era: '1792 \u2013 1924 AD',
        teaser:
          'Reform, nationalism, and global war carried the Ottoman order into its final transformation.',
      },
    ],
    map: {
      viewBox: '170 55 290 205',
      caption:
        'At its sixteenth-century height, Ottoman rule linked the Balkans, Anatolia, the Arab provinces, and North Africa through one imperial center at Istanbul.',
      capitalA: { cx: 338, cy: 150, label: 'Istanbul' },
      provinces: [
        {
          name: 'Rumelia',
          d: 'M270,110 L320,100 L340,118 L335,145 L305,155 L280,145 L265,128 Z',
          primary: true,
        },
        {
          name: 'Anatolia',
          d: 'M335,138 L390,130 L412,142 L408,164 L372,174 L338,165 L330,150 Z',
          primary: true,
        },
        {
          name: 'Egypt',
          d: 'M350,192 L365,190 L372,210 L376,236 L365,242 L354,226 L346,208 Z',
        },
        {
          name: 'Syria',
          d: 'M388,164 L404,160 L410,180 L402,196 L388,190 L382,176 Z',
        },
        {
          name: 'Iraq',
          d: 'M408,160 L430,154 L438,170 L434,188 L414,186 L402,172 Z',
        },
        {
          name: 'Arabia',
          d: 'M394,188 L420,196 L428,228 L408,246 L384,224 L386,198 Z',
        },
        {
          name: 'Algeria',
          d: 'M196,188 L234,186 L258,194 L250,206 L212,208 L190,198 Z',
        },
        {
          name: 'Hungary',
          d: 'M304,92 L330,88 L346,102 L342,118 L320,122 L298,110 Z',
        },
      ],
    },
    closingQuote:
      'To rule an empire was to hold together many languages, laws, and frontiers under a single imperial horizon.',
  },
};

/* ================================================================
   HOOKS
   ================================================================ */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function useCountUp(target: string, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  const numericPart = target.replace(/[^0-9]/g, '');
  const num = parseInt(numericPart, 10);
  const suffix = target.replace(/[0-9]/g, '');
  useEffect(() => {
    if (!active || isNaN(num)) return;
    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= num) {
        setVal(num);
        clearInterval(timer);
      } else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, duration, num]);
  if (isNaN(num)) return target;
  return `${val.toLocaleString()}${suffix}`;
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function StatCard({
  stat,
  index,
  visible,
}: {
  stat: Stat;
  index: number;
  visible: boolean;
}) {
  const display = useCountUp(stat.value, 1600 + index * 200, visible);
  const isNumeric = /\d/.test(stat.value);
  return (
    <div
      style={{
        flex: '1 1 140px',
        padding: '20px 16px',
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))',
        border: '1px solid rgba(240,236,226,0.04)',
        borderRadius: '6px',
        textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.6s cubic-bezier(0.23,1,0.32,1) ${0.15 + index * 0.08}s`,
      }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #F4D03F, #C9A84C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.1,
          marginBottom: '2px',
        }}
      >
        {isNumeric ? display : stat.value}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(240,236,226,0.3)',
          marginBottom: '6px',
        }}
      >
        {stat.unit}
      </div>
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.4)',
          fontWeight: 500,
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

function RulerCard({
  ruler,
  index,
  visible,
}: {
  ruler: Ruler;
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const initials = ruler.name
    .split(' ')
    .map((w) => w[0])
    .join('');
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '0 0 200px',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? 'translateY(-6px)'
            : 'translateY(0)'
          : 'translateY(30px)',
        transition: `opacity 0.7s ease ${0.1 + index * 0.1}s, transform 0.4s cubic-bezier(0.23,1,0.32,1)`,
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '3/4',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '14px',
          background: `linear-gradient(160deg, rgba(12,11,9,1) 0%, ${ruler.color}11 100%)`,
          border: `1px solid ${hovered ? ruler.color + '35' : 'rgba(240,236,226,0.05)'}`,
          transition: 'border-color 0.4s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '64px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: `${ruler.color}${hovered ? '20' : '10'}`,
              transition: 'color 0.4s ease',
              letterSpacing: '0.05em',
            }}
          >
            {initials}
          </span>
        </div>
        {[
          { top: 8, left: 8, bt: '1px', bl: '1px' },
          { top: 8, right: 8, bt: '1px', br: '1px' },
          { bottom: 8, left: 8, bb: '1px', bl: '1px' },
          { bottom: 8, right: 8, bb: '1px', br: '1px' },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 'top' in pos ? pos.top : undefined,
              left: 'left' in pos ? pos.left : undefined,
              right: 'right' in pos ? pos.right : undefined,
              bottom: 'bottom' in pos ? pos.bottom : undefined,
              width: '18px',
              height: '18px',
              borderTop: 'bt' in pos ? `1px solid ${ruler.color}22` : 'none',
              borderBottom: 'bb' in pos ? `1px solid ${ruler.color}22` : 'none',
              borderLeft: 'bl' in pos ? `1px solid ${ruler.color}22` : 'none',
              borderRight: 'br' in pos ? `1px solid ${ruler.color}22` : 'none',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px 14px 12px',
            background: 'linear-gradient(transparent, rgba(12,11,9,0.9))',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: `${ruler.color}88`,
              fontWeight: 500,
            }}
          >
            {ruler.title}
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '17px',
          fontWeight: 600,
          color: hovered ? 'rgba(240,236,226,0.95)' : 'rgba(240,236,226,0.8)',
          marginBottom: '3px',
          transition: 'color 0.3s ease',
        }}
      >
        {ruler.name}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(240,236,226,0.3)',
          marginBottom: '6px',
        }}
      >
        {ruler.reign}
      </div>
      <div
        style={{
          fontSize: '13px',
          lineHeight: 1.55,
          color: 'rgba(240,236,226,0.4)',
        }}
      >
        {ruler.desc}
      </div>
    </div>
  );
}

function MiniMap({ config, visible }: { config: MapConfig; visible: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div
      style={{
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 0.9s cubic-bezier(0.23,1,0.32,1) 0.2s',
      }}
    >
      <svg
        viewBox={config.viewBox}
        style={{
          width: '100%',
          maxWidth: '600px',
          filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.04))',
        }}
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
          </radialGradient>
          <filter id="mapBlur">
            <feGaussianBlur stdDeviation={2} />
          </filter>
        </defs>
        <ellipse cx="310" cy="165" rx="130" ry="80" fill="url(#mapGlow)" />
        <ellipse
          cx="300"
          cy="185"
          rx="90"
          ry="30"
          fill="rgba(40,60,80,0.15)"
          filter="url(#mapBlur)"
        />
        {config.provinces.map((prov) => {
          const isH = hovered === prov.name;
          return (
            <g
              key={prov.name}
              onMouseEnter={() => setHovered(prov.name)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <path
                d={prov.d}
                fill={
                  isH
                    ? prov.primary
                      ? 'rgba(139,0,0,0.35)'
                      : 'rgba(201,168,76,0.18)'
                    : prov.primary
                      ? 'rgba(139,0,0,0.2)'
                      : 'rgba(201,168,76,0.08)'
                }
                stroke={
                  isH
                    ? prov.primary
                      ? 'rgba(139,0,0,0.6)'
                      : 'rgba(201,168,76,0.35)'
                    : prov.primary
                      ? 'rgba(139,0,0,0.35)'
                      : 'rgba(201,168,76,0.12)'
                }
                strokeWidth={prov.primary ? 1.2 : 0.7}
                style={{ transition: 'all 0.3s ease' }}
              />
            </g>
          );
        })}
        <circle
          cx={config.capitalA.cx}
          cy={config.capitalA.cy}
          r={3}
          fill="#C9A84C"
          opacity={0.7}
        >
          <animate
            attributeName="r"
            values="3;5;3"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;0.3;0.7"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle
          cx={config.capitalA.cx}
          cy={config.capitalA.cy}
          r={2}
          fill="#C9A84C"
        />
        {config.capitalB && (
          <>
            <circle
              cx={config.capitalB.cx}
              cy={config.capitalB.cy}
              r={2}
              fill="rgba(201,168,76,0.5)"
            >
              <animate
                attributeName="r"
                values="2;3.5;2"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={config.capitalB.cx}
              cy={config.capitalB.cy}
              r={1.5}
              fill="rgba(201,168,76,0.6)"
            />
          </>
        )}
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginTop: '8px',
          fontSize: '11px',
          color: 'rgba(240,236,226,0.3)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#C9A84C',
              opacity: 0.6,
              display: 'inline-block',
            }}
          />
          {config.capitalA.label}
        </span>
        {config.capitalB && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'rgba(201,168,76,0.4)',
                display: 'inline-block',
              }}
            />
            {config.capitalB.label}
          </span>
        )}
        {hovered && (
          <span
            style={{
              color: 'rgba(201,168,76,0.6)',
              fontStyle: 'italic',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {hovered}
          </span>
        )}
      </div>
    </div>
  );
}

function TimelinePreview({
  events,
  visible,
}: {
  events: TimelineEvent[];
  visible: boolean;
}) {
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  return (
    <div
      style={{
        position: 'relative',
        padding: '20px 0',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease 0.3s',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: '2px',
          background: 'rgba(240,236,226,0.05)',
          borderRadius: '1px',
          margin: '40px 0 60px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '10%',
            height: '100%',
            borderRadius: '1px',
            background: visible
              ? 'linear-gradient(90deg, rgba(139,0,0,0.4), rgba(201,168,76,0.3), rgba(201,168,76,0.15), transparent)'
              : 'transparent',
            transition: 'background 1.5s ease 0.5s',
          }}
        />
        {events.map((evt, i) => {
          const isH = hovIdx === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
              style={{
                position: 'absolute',
                left: `${evt.pos}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isH ? 10 : 1,
              }}
            >
              <div style={{ padding: '12px', margin: '-12px' }}>
                <div
                  style={{
                    width: isH ? '10px' : '6px',
                    height: isH ? '10px' : '6px',
                    borderRadius: '50%',
                    background: isH ? '#C9A84C' : 'rgba(201,168,76,0.4)',
                    border: isH ? '2px solid rgba(201,168,76,0.3)' : 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: isH ? '0 0 12px rgba(201,168,76,0.25)' : 'none',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: i % 2 === 0 ? '-32px' : '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  fontWeight: 500,
                  fontFamily: "'Playfair Display', serif",
                  color: isH
                    ? 'rgba(201,168,76,0.8)'
                    : 'rgba(240,236,226,0.25)',
                  transition: 'color 0.25s ease',
                }}
              >
                {evt.year}
              </div>
              {isH && (
                <div
                  style={{
                    position: 'absolute',
                    top: i % 2 === 0 ? '28px' : '-52px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    padding: '6px 12px',
                    background: 'rgba(12,11,9,0.95)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'rgba(240,236,226,0.7)',
                  }}
                >
                  {evt.label}
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(201,168,76,0.4)',
                      marginTop: '2px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {evt.era}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChapterCard({
  chapter,
  index,
  visible,
}: {
  chapter: ChapterPreview;
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        padding: '20px 24px',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.015)' : 'transparent',
        borderLeft: `2px solid ${hovered ? 'rgba(201,168,76,0.35)' : 'rgba(240,236,226,0.04)'}`,
        transition: 'all 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-16px)',
        transitionDelay: `${0.08 * index}s`,
      }}
    >
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px',
          fontWeight: 300,
          fontStyle: 'italic',
          color: hovered ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.15)',
          transition: 'color 0.3s ease',
          lineHeight: 1,
          minWidth: '36px',
        }}
      >
        {chapter.num}
      </span>
      <div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '17px',
            fontWeight: 600,
            color: hovered ? 'rgba(240,236,226,0.9)' : 'rgba(240,236,226,0.65)',
            transition: 'color 0.3s ease',
            marginBottom: '3px',
          }}
        >
          {chapter.title}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(240,236,226,0.25)',
            marginBottom: '6px',
          }}
        >
          {chapter.era}
        </div>
        <div
          style={{
            fontSize: '13px',
            lineHeight: 1.55,
            color: 'rgba(240,236,226,0.35)',
            maxHeight: hovered ? '40px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.4s ease, opacity 0.3s ease',
            opacity: hovered ? 1 : 0,
          }}
        >
          {chapter.teaser}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  align = 'left',
}: {
  label: string;
  title: string;
  align?: string;
}) {
  return (
    <div
      style={{
        textAlign: align as React.CSSProperties['textAlign'],
        marginBottom: '32px',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.4)',
          fontWeight: 500,
          marginBottom: '8px',
        }}
      >
        {label}
      </div>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(22px, 3vw, 30px)',
          fontWeight: 500,
          color: 'rgba(240,236,226,0.85)',
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */
function formatOverviewRange(start: number, end: number): string {
  const format = (year: number) =>
    year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;

  return `${format(start)} - ${format(end)}`;
}

function buildDefaultStats(empire: EmpireConfig, stats: EmpireStats): Stat[] {
  return [
    {
      label: 'Duration',
      value: `${empire.endYear - empire.startYear}`,
      unit: 'years',
    },
    { label: 'Capital', value: empire.capital, unit: 'seat of rule' },
    { label: 'Rulers', value: `${stats.rulers}`, unit: 'recorded' },
    { label: 'Events', value: `${stats.events}`, unit: 'key moments' },
    { label: 'Battles', value: `${stats.battles}`, unit: 'recorded' },
    { label: 'Places', value: `${stats.places}`, unit: 'mapped' },
  ];
}

function GenericEmpireOverview({
  empire,
  stats,
}: {
  empire: EmpireConfig;
  stats: EmpireStats;
}) {
  const genericStats = buildDefaultStats(empire, stats);

  const [statsRef, statsVis] = useReveal(0.2);

  return (
    <div style={{ position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
      <p
        style={{
          fontSize: '16px',
          lineHeight: 1.75,
          color: 'rgba(240,236,226,0.55)',
          maxWidth: '780px',
          margin: '0 0 48px',
          fontWeight: 300,
        }}
      >
        {empire.name} ({empire.nativeName}) spanned{' '}
        {formatOverviewRange(empire.startYear, empire.endYear)}. The sections
        above already contain live data for this empire, and the overview now
        reflects the records currently available in the database.
      </p>

      <section ref={statsRef} style={{ marginBottom: '40px' }}>
        <SectionHeading label="At a glance" title={`${empire.name} Overview`} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {genericStats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} visible={statsVis} />
          ))}
        </div>
      </section>

      <section
        style={{
          padding: '28px 24px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid rgba(240,236,226,0.04)',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.4)',
            fontWeight: 500,
            marginBottom: '12px',
          }}
        >
          Current Data Coverage
        </div>
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.75,
            color: 'rgba(240,236,226,0.45)',
            margin: 0,
          }}
        >
          Explore rulers, timeline, map, territorial snapshots, chapters, quiz,
          analytics, and personality results for the {empire.name}. This
          overview falls back to live empire statistics whenever a curated
          long-form overview has not yet been authored.
        </p>
      </section>
    </div>
  );
}

export function EmpireOverview({
  empire,
  stats,
}: {
  empire: EmpireConfig;
  stats: EmpireStats;
}) {
  const content = CONTENT[empire.slug];

  const [statsRef, statsVis] = useReveal(0.2);
  const [rulersRef, rulersVis] = useReveal(0.1);
  const [mapRef, mapVis] = useReveal(0.15);
  const [timelineRef, timelineVis] = useReveal(0.15);
  const [chaptersRef, chaptersVis] = useReveal(0.1);
  const displayStats = content?.stats ?? buildDefaultStats(empire, stats);
  const chapterTitle = `${content?.chapters.length ?? 0} Chapters`;

  // Fallback for empires without content yet
  if (!content) {
    return <GenericEmpireOverview empire={empire} stats={stats} />;
  }

  return (
    <div style={{ position: 'relative', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Google Fonts — ideally move to layout.tsx later */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Narrative hook */}
      <p
        style={{
          fontSize: '16px',
          lineHeight: 1.75,
          color: 'rgba(240,236,226,0.55)',
          maxWidth: '780px',
          margin: '0 0 48px',
          fontWeight: 300,
        }}
      >
        {content.hook}
      </p>

      {/* Stats */}
      <section ref={statsRef} style={{ marginBottom: '80px' }}>
        <SectionHeading label="At a glance" title="Empire by the Numbers" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {displayStats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} visible={statsVis} />
          ))}
        </div>
      </section>

      {/* Featured Rulers */}
      <section ref={rulersRef} style={{ marginBottom: '80px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <SectionHeading label="Who ruled" title="Notable Rulers" />
          <a
            href={`/${empire.slug}/rulers`}
            style={{
              fontSize: '12px',
              color: 'rgba(201,168,76,0.35)',
              paddingBottom: '6px',
              borderBottom: '1px solid rgba(201,168,76,0.12)',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
          >
            View all rulers &rarr;
          </a>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            paddingBottom: '12px',
          }}
        >
          {content.rulers.map((ruler, i) => (
            <RulerCard key={i} ruler={ruler} index={i} visible={rulersVis} />
          ))}
        </div>
      </section>

      {/* Map + Chapters split */}
      <div
        className="empire-overview-split"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          marginBottom: '80px',
        }}
      >
        <section ref={mapRef}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <SectionHeading label="Territory" title="Empire at its Height" />
            <a
              href={`/${empire.slug}/map`}
              style={{
                fontSize: '12px',
                color: 'rgba(201,168,76,0.35)',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(201,168,76,0.12)',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
            >
              Explore map &rarr;
            </a>
          </div>
          <div
            style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(240,236,226,0.04)',
              borderRadius: '8px',
            }}
          >
            <MiniMap config={content.map} visible={mapVis} />
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'rgba(240,236,226,0.35)',
                marginTop: '16px',
                textAlign: 'center',
              }}
            >
              {content.map.caption}
            </p>
          </div>
        </section>

        <section ref={chaptersRef}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <SectionHeading label="Read the story" title={chapterTitle} />
            <a
              href={`/${empire.slug}/chapters`}
              style={{
                fontSize: '12px',
                color: 'rgba(201,168,76,0.35)',
                paddingBottom: '6px',
                borderBottom: '1px solid rgba(201,168,76,0.12)',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
            >
              Read all &rarr;
            </a>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(240,236,226,0.04)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {content.chapters.map((ch, i) => (
              <ChapterCard
                key={i}
                chapter={ch}
                index={i}
                visible={chaptersVis}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Timeline */}
      <section ref={timelineRef} style={{ marginBottom: '60px' }}>
        <SectionHeading
          label="Through time"
          title="Key Events Across the Centuries"
          align="center"
        />
        <div
          style={{
            padding: '20px 32px',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(240,236,226,0.04)',
            borderRadius: '8px',
          }}
        >
          <TimelinePreview events={content.timeline} visible={timelineVis} />
        </div>
      </section>

      {/* Closing quote */}
      <section style={{ textAlign: 'center', padding: '40px 0 20px' }}>
        <div
          style={{
            width: '40px',
            height: '1px',
            margin: '0 auto 28px',
            background:
              'linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)',
          }}
        />
        <p
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(20px, 3vw, 26px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(240,236,226,0.45)',
            maxWidth: '600px',
            margin: '0 auto 12px',
            lineHeight: 1.5,
          }}
        >
          &ldquo;{content.closingQuote}&rdquo;
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(240,236,226,0.2)' }}>
          Begin with Chapter I, or explore the tabs above.
        </p>
      </section>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .empire-overview-split {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
