import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getChapters } from '@/lib/services/chapters';
import { createClient } from '@/lib/supabase/server';
import { ChaptersContainer } from '@/components/chapters/ChaptersContainer';

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
    title: `${empire.name} — Historical Chapters`,
    description: `Read through the history of the ${empire.name} in structured storytelling chapters, from its founding to its fall.`,
  };
}

export default async function ChaptersPage({
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
  const chapters = await getChapters(supabase, empire.id);

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
            Storytelling Chapters
          </p>
        </div>
      </header>
      <ChaptersContainer empire={empire} chapters={chapters} />
    </main>
  );
}
