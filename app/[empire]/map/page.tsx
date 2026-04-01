import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import InteractiveMap from '@/components/map/InteractiveMap';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

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
        <div style={{ marginBottom: '32px' }}>
          <Link
            href={`/${empire.slug}`}
            aria-label={`Back to ${empire.name}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '999px',
              fontSize: '0',
              fontWeight: 600,
              color: '#C9A84C',
              letterSpacing: '0.06em',
              textTransform: 'none',
              textDecoration: 'none',
              border: '1px solid rgba(201,168,76,0.18)',
              background: 'rgba(201,168,76,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition:
                'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '11px' }}>
              &larr;
            </span>
            <span style={{ fontSize: '11px' }}>{empire.name}</span>
          </Link>
        </div>
        <div className="border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <h1 className="font-display text-3xl font-bold tracking-wide">
            {empire.name}
          </h1>
          <p className="mt-1 text-sm tracking-widest text-[#C9A84C] uppercase">
            Interactive Map
          </p>
        </div>
      </header>
      <ErrorBoundary moduleName="Interactive map">
        <InteractiveMap empire={empire} />
      </ErrorBoundary>
    </main>
  );
}
