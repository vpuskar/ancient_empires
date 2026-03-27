/**
 * Empire Theme System
 *
 * Maps empire config to CSS custom properties for Tailwind v4.
 * Used by the EmpireThemeProvider to set runtime CSS variables
 * that Tailwind utilities can reference.
 *
 * Usage in Tailwind v4 CSS:
 *   @theme { --color-empire: var(--empire-color); }
 *   Then: className="text-empire"
 *
 * Usage in components:
 *   import { getEmpireTheme } from '@/lib/empires/theme';
 *   const theme = getEmpireTheme('roman');
 *   <div style={theme.cssVars}> ... </div>
 */

import { EMPIRE_CONFIGS } from '@/lib/empires/config';

export interface EmpireTheme {
  /** Primary empire color (e.g. #8B0000 for Roman) */
  primary: string;
  /** Lighter variant for hover states and accents */
  primaryLight: string;
  /** Empire slug for data-attribute selectors */
  slug: string;
  /** Display name */
  name: string;
  /** CSS custom properties object — spread onto a wrapper div's style */
  cssVars: Record<string, string>;
}

/**
 * Lighter variant of a hex color (raise each channel by ~30%)
 */
function lighten(hex: string, amount = 0.3): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lightenChannel = (c: number) =>
    Math.min(255, Math.round(c + (255 - c) * amount));
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(lightenChannel(r))}${toHex(lightenChannel(g))}${toHex(lightenChannel(b))}`;
}

/**
 * Font stack per empire — lazy-loaded via next/font/google
 * Default: Playfair Display (display) + DM Sans (body)
 * Ottoman gets Noto Sans Arabic as fallback
 * Chinese gets Noto Serif SC
 * Japanese gets Noto Serif JP
 */
const EMPIRE_FONTS: Record<string, { display: string; body: string }> = {
  roman: {
    display: "'Playfair Display', serif",
    body: "'DM Sans', sans-serif",
  },
  chinese: {
    display: "'Playfair Display', 'Noto Serif SC', serif",
    body: "'DM Sans', 'Noto Sans SC', sans-serif",
  },
  japanese: {
    display: "'Playfair Display', 'Noto Serif JP', serif",
    body: "'DM Sans', 'Noto Sans JP', sans-serif",
  },
  ottoman: {
    display: "'Playfair Display', serif",
    body: "'DM Sans', 'Noto Sans Arabic', sans-serif",
  },
};

export function getEmpireTheme(slug: string): EmpireTheme {
  const config = EMPIRE_CONFIGS.find((e) => e.slug === slug);

  if (!config) {
    // Fallback to a neutral theme
    return {
      primary: '#C9A84C',
      primaryLight: '#E8C547',
      slug: 'unknown',
      name: 'Unknown Empire',
      cssVars: {
        '--empire-color': '#C9A84C',
        '--empire-color-light': '#E8C547',
        '--empire-font-display': "'Playfair Display', serif",
        '--empire-font-body': "'DM Sans', sans-serif",
      },
    };
  }

  const primary = config.color;
  const primaryLight = lighten(primary);
  const fonts = EMPIRE_FONTS[slug] ?? EMPIRE_FONTS.roman;

  return {
    primary,
    primaryLight,
    slug: config.slug,
    name: config.name,
    cssVars: {
      '--empire-color': primary,
      '--empire-color-light': primaryLight,
      '--empire-font-display': fonts.display,
      '--empire-font-body': fonts.body,
    },
  };
}

/**
 * Returns the text-direction for an empire.
 * Only Ottoman native_name spans use RTL; the page itself stays LTR.
 */
export function getEmpireDir(slug: string): 'ltr' | 'rtl' {
  return slug === 'ottoman' ? 'rtl' : 'ltr';
}

/**
 * Map tile URLs per empire theme.
 * Roman/default uses Positron (light).
 * Could swap to dark for a specific empire if needed.
 */
export const MAP_TILES = {
  light: {
    base: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    labels:
      'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    labelsOpacity: 0.55,
  },
  dark: {
    base: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
    labels:
      'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
    labelsOpacity: 0.48,
  },
} as const;
