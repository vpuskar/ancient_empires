import type { Metadata } from 'next';

const SITE_NAME = 'Ancient Empires';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ancient-empires.vercel.app';
const DEFAULT_DESCRIPTION =
  'An interactive history platform exploring the Roman, Chinese, Japanese, and Ottoman Empires through maps, timelines, quizzes, and storytelling.';
const OG_FALLBACK = `${SITE_URL}/og-fallback.png`;

export interface PageMetaOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  rawTitle?: boolean;
}

export function buildMetadata(options: PageMetaOptions): Metadata {
  const { title, description, path, ogImage, noIndex, rawTitle } = options;
  const url = `${SITE_URL}${path}`;
  const fullTitle = rawTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage || OG_FALLBACK,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage || OG_FALLBACK],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function buildEmpirePageMetadata(
  empireName: string,
  empireSlug: string,
  pageTitle: string,
  description: string,
  pagePath: string
): Metadata {
  return buildMetadata({
    title: `${pageTitle} — ${empireName}`,
    description,
    path: `/${empireSlug}${pagePath}`,
  });
}

export { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL };
