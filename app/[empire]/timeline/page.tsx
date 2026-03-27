import { notFound } from 'next/navigation';
import { EmpireTimeline } from '@/components/timeline/EmpireTimeline';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getEvents } from '@/lib/services/events';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600;

export default async function EmpireTimelinePage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  const supabase = await createClient();
  const events = await getEvents(supabase, empire.id);

  return <EmpireTimeline empire={empire} events={events} />;
}
