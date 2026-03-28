import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import InteractiveMap from '@/components/map/InteractiveMap';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);
  if (!empire) return {};

  return {
    title: `${empire.name} — Interactive Map`,
    description: `Explore cities, forts, temples, ports, and battle sites of the ${empire.name} on an interactive map.`,
  };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0C0B09] text-[#F0ECE2]">
      <header className="px-6 py-6">
        <div className="border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <h1 className="font-display text-3xl font-bold tracking-wide">
            {empire.name}
          </h1>
          <p className="mt-1 text-sm tracking-widest text-[#C9A84C] uppercase">
            Interactive Map
          </p>
        </div>
      </header>
      <InteractiveMap empire={empire} />
    </main>
  );
}
