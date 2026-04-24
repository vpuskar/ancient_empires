import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ancient-empires.vercel.app';

const FULL_CONTENT_SLUGS = ['roman', 'ottoman', 'chinese', 'japanese'];
const ALL_SLUGS = ['roman', 'ottoman', 'chinese', 'japanese'];

const EMPIRE_SUB_PAGES = ['/rulers', '/map', '/timeline', '/chapters'];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  for (const slug of ALL_SLUGS) {
    entries.push({
      url: `${SITE_URL}/${slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    if (FULL_CONTENT_SLUGS.includes(slug)) {
      for (const page of EMPIRE_SUB_PAGES) {
        entries.push({
          url: `${SITE_URL}/${slug}${page}`,
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}
