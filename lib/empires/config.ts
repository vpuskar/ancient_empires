export interface EmpireConfig {
  id: number;
  name: string;
  nativeName: string;
  slug: string;
  color: string;
  start: number;
  end: number;
  startYear: number;
  endYear: number;
}

export const EMPIRE_CONFIGS: EmpireConfig[] = [
  {
    id: 1,
    name: 'Roman Empire',
    nativeName: 'Imperium Romanum',
    slug: 'roman',
    color: '#8B0000',
    start: -509,
    end: 476,
    startYear: -509,
    endYear: 476,
  },
  {
    id: 2,
    name: 'Chinese Empire',
    nativeName: 'Zhonghua Diguo',
    slug: 'chinese',
    color: '#DE2910',
    start: -221,
    end: 1912,
    startYear: -221,
    endYear: 1912,
  },
  {
    id: 3,
    name: 'Japanese Empire',
    nativeName: 'Dai Nippon Teikoku',
    slug: 'japanese',
    color: '#BC002D',
    start: -660,
    end: 1945,
    startYear: -660,
    endYear: 1945,
  },
  {
    id: 4,
    name: 'Ottoman Empire',
    nativeName: 'Devlet-i Aliyye-i Osmaniye',
    slug: 'ottoman',
    color: '#1A6B3A',
    start: 1299,
    end: 1922,
    startYear: 1299,
    endYear: 1922,
  },
];

export function getEmpireBySlug(slug: string): EmpireConfig | undefined {
  return EMPIRE_CONFIGS.find((e) => e.slug === slug);
}
