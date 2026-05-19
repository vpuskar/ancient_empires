import { notFound } from 'next/navigation';

import OdysseyCanvas from '@/components/timeline/odyssey/OdysseyCanvas';
import { getEmpireBySlug } from '@/lib/empires/config';
import { buildEmpirePageMetadata } from '@/lib/seo/metadata';
import { getTimelineByEmpire } from '@/lib/services/timeline';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    return {};
  }

  return buildEmpirePageMetadata(
    empire.name,
    slug,
    'Timeline',
    `${empire.name} timeline - key periods and events from rise to fall.`,
    '/timeline'
  );
}

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  // Roman chapter structure is thematic, not chronological - being restructured
  // in a separate branch. Show the empty state until chronological chapters land.
  if (empire.id === 1) {
    return <OdysseyCanvas empire={empire} data={{ chapters: [] }} />;
  }

  const data = await getTimelineByEmpire(empire.id);

  return <OdysseyCanvas empire={empire} data={data} />;
}
