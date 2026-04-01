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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '11px',
              color: 'rgba(240,236,226,0.35)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ← {empire.name}
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
