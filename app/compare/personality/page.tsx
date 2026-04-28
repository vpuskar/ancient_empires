import CrossPersonalityQuiz from '@/components/compare/CrossPersonalityQuiz';
import { buildMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-static';

const description =
  'Take the cross-empire personality quiz and discover which of the four great empires — Roman, Chinese, Japanese, or Ottoman — would claim you.';

export function generateMetadata() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ancient-empires.vercel.app';
  const ogUrl = new URL('/api/og/personality', siteUrl);
  ogUrl.searchParams.set('empireSlug', 'ottoman');
  ogUrl.searchParams.set('rulerName', 'Suleiman I');
  ogUrl.searchParams.set(
    'rulerTitle',
    'Will Rome, China, Japan, or the Ottoman Empire claim you?'
  );
  ogUrl.searchParams.set('matchPercent', '84');
  ogUrl.searchParams.set('traits', 'Power,Legacy,Ambition');
  const ogImage = ogUrl.toString();
  const existingMetadata = buildMetadata({
    title: 'Which Empire Claims You?',
    description,
    path: '/compare/personality',
  });

  return {
    ...existingMetadata,
    openGraph: {
      ...existingMetadata.openGraph,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      ...existingMetadata.twitter,
      card: 'summary_large_image',
      images: [ogImage],
    },
  };
}

export default function ComparePersonalityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <CrossPersonalityQuiz />
    </main>
  );
}
