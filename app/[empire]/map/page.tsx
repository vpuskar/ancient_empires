import { notFound } from 'next/navigation';
import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import { MapClientWrapper } from '@/components/map/MapClientWrapper';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getPlaces } from '@/lib/services/places';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600;

export default async function EmpireMapPage({
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
  const places = await getPlaces(supabase, empire.id);
  const mappablePlaces = places.filter(
    (place) =>
      typeof place.lat === 'number' &&
      Number.isFinite(place.lat) &&
      typeof place.lng === 'number' &&
      Number.isFinite(place.lng)
  );

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Interactive Map
          </p>
          <h1 className="text-4xl font-bold">{empire.name} Places</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Explore mapped places across the {empire.name}. Click a marker to inspect
            its place type and founded year.
          </p>
        </header>

        <EmpireSectionNav empire={empire} />

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
          <MapClientWrapper empire={empire} places={mappablePlaces} />
        </section>
      </div>
    </main>
  );
}
