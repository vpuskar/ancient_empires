import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getAnalyticsData } from '@/lib/services/analytics';
import { AnalyticsDashboard } from './_components/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

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
    title: `Analytics — ${empire.name} | Ancient Empires`,
  };
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  const data = await getAnalyticsData(empire.id);

  return <AnalyticsDashboard empire={empire} data={data} />;
}
