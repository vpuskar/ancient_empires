import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPersonalityConfig } from '@/lib/config/personality';
import { getEmpireBySlug } from '@/lib/empires/config';
import { buildMetadata } from '@/lib/seo/metadata';
import { PersonalityQuiz } from './_components/PersonalityQuiz';

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}): Promise<Metadata> {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);
  const config = empire ? getPersonalityConfig(empire.id) : null;

  if (!empire || !config) {
    return {};
  }

  const defaultRulerNames = {
    roman: 'Augustus',
    chinese: 'Qin Shi Huang',
    japanese: 'Emperor Meiji',
    ottoman: 'Suleiman I',
  } as const;
  const defaultRulerName =
    defaultRulerNames[empire.slug as keyof typeof defaultRulerNames] ??
    config.rulers[0]?.name ??
    'Augustus';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ancient-empires.vercel.app';
  const ogUrl = new URL('/api/og/personality', siteUrl);
  ogUrl.searchParams.set('empireSlug', empire.slug);
  ogUrl.searchParams.set('rulerName', defaultRulerName);
  ogUrl.searchParams.set('rulerTitle', 'Discover your historical match');
  ogUrl.searchParams.set('matchPercent', '75');
  ogUrl.searchParams.set('traits', 'Strategic,Visionary,Legacy-builder');
  const base = buildMetadata({
    title: `Which ${config.displayName} Ruler Are You? | Ancient Empires`,
    description: `Discover which ${config.displayName} ruler matches your personality. Answer 8 questions about power, leadership, and legacy.`,
    path: `/${empire.slug}/personality`,
    rawTitle: true,
  });

  return {
    ...base,
    openGraph: {
      ...(base.openGraph ?? {}),
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      ...(base.twitter ?? {}),
      card: 'summary_large_image',
      images: [ogUrl.toString()],
    },
  };
}

export default async function PersonalityPage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  const config = getPersonalityConfig(empire.id);

  if (!config) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#120C08_0%,#1A1210_48%,#0D0A07_100%)] px-4 py-8 text-[#F5E6C8] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PersonalityQuiz empire={empire} config={config} />
      </div>
    </main>
  );
}
