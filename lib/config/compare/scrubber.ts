export const SCRUBBER_MIN = -500;
export const SCRUBBER_MAX = 1938;
export const SCRUBBER_DEFAULT = 100;

export const APEX_SNAPS: Array<{
  year: number;
  label: string;
  empire_id: number;
}> = [
  { year: -221, label: 'Qin unification', empire_id: 2 },
  { year: 100, label: 'Roman apex — Trajan', empire_id: 1 },
  { year: 618, label: 'Tang dynasty', empire_id: 2 },
  { year: 1520, label: 'Ottoman apex — Suleiman', empire_id: 4 },
  { year: 1644, label: 'Qing dynasty', empire_id: 2 },
  { year: 1868, label: 'Meiji Restoration', empire_id: 3 },
  { year: 1938, label: 'Japanese imperial peak', empire_id: 3 },
];

export const BUTTERFLY_BANDS: Array<{
  start: number;
  end: number;
  label: string;
  color: string;
}> = [
  {
    start: 100,
    end: 400,
    label: 'Silk Road peak',
    color: 'rgba(212,175,55,0.12)',
  },
  {
    start: 1299,
    end: 1600,
    label: 'Ottoman–Ming trade',
    color: 'rgba(26,107,58,0.10)',
  },
];
