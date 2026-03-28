import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getChapterBySlug } from '@/lib/services/chapters';
import { createClient } from '@/lib/supabase/server';
import { ChapterReader } from '@/components/chapters/ChapterReader';

export const revalidate = 3600;

function formatYear(year: number | null): string {
  if (year === null) return 'Unknown';
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string; slug: string }>;
}) {
  const { empire: empireSlug, slug } = await params;
  const empire = getEmpireBySlug(empireSlug);
  if (!empire) return {};

  const supabase = await createClient();
  const chapter = await getChapterBySlug(supabase, empire.id, slug);
  if (!chapter) return {};

  return {
    title: `${chapter.title} — ${empire.name}`,
    description: `${chapter.title}: a chapter in the history of the ${empire.name}.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ empire: string; slug: string }>;
}) {
  const { empire: empireSlug, slug } = await params;
  const empire = getEmpireBySlug(empireSlug);

  if (!empire) {
    notFound();
  }

  const supabase = await createClient();
  const chapter = await getChapterBySlug(supabase, empire.id, slug);

  if (!chapter) {
    notFound();
  }

  const periodRange =
    chapter.period_start !== null && chapter.period_end !== null
      ? `${formatYear(chapter.period_start)} – ${formatYear(chapter.period_end)}`
      : null;

  return (
    <main className="min-h-screen bg-[#0C0B09] text-[#F0ECE2]">
      <header className="px-6 py-6">
        <div className="border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <p className="text-xs tracking-widest text-[#8B7355] uppercase">
            Chapter {chapter.sort_order}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-wide">
            {chapter.title}
          </h1>
          {periodRange && (
            <p
              className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${empire.color}15`,
                color: empire.color,
                border: `1px solid ${empire.color}30`,
              }}
            >
              {periodRange}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <article className="rounded-xl border border-[#8B7355]/20 bg-[#1a1815]/60 p-6 md:p-8">
          <ChapterReader content={chapter.content_md} />
        </article>
      </div>
    </main>
  );
}
