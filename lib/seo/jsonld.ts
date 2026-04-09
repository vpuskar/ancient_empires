import { SITE_NAME, SITE_URL } from './metadata';

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-fallback.png`,
    description:
      'An interactive history platform exploring the Roman, Chinese, Japanese, and Ottoman Empires.',
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildQuizJsonLd(
  name: string,
  description: string,
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name,
    description,
    url,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function buildArticleJsonLd(
  title: string,
  description: string,
  url: string,
  datePublished?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-fallback.png`,
      },
    },
    ...(datePublished ? { datePublished } : {}),
  };
}
