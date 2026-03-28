import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getEventsWithRulers } from '@/lib/services/events';
import { createClient } from '@/lib/supabase/server';
import { TimelineContainer } from '@/components/timeline/TimelineContainer';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);
  if (!empire) return {};

  return {
    title: `${empire.name} — Historical Timeline`,
    description: `Explore ${empire.name} history through an interactive timeline of key political, military, and cultural events.`,
  };
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

  const supabase = await createClient();
  const events = await getEventsWithRulers(supabase, empire.id);

  return (
    <main className="min-h-screen bg-[#0C0B09] text-[#F0ECE2]">
      <header className="px-6 py-6">
        <div className="border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <h1 className="font-display text-3xl font-bold tracking-wide">
            {empire.name}
          </h1>
          <p className="mt-1 text-sm tracking-widest text-[#C9A84C] uppercase">
            Historical Timeline
          </p>
        </div>
      </header>
      <TimelineContainer empire={empire} events={events} />
    </main>
  );
}
