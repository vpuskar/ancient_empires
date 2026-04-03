import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getTerritorialData } from '@/lib/services/territorial';
import { TerritorialTimeline } from './_components/TerritorialTimeline';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}): Promise<Metadata> {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    return {};
  }

  return {
    title: `Territorial Timeline - ${empire.name} | Ancient Empires`,
    description: `Watch the ${empire.name} grow and decline across centuries through an interactive territorial timeline.`,
  };
}

export default async function TerritorialPage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  const data = await getTerritorialData(empire.id);

  return <TerritorialTimeline empire={empire} data={data} />;
}
