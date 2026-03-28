import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getChapters } from '@/lib/services/chapters';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600;

function formatYear(year: number | null): string {
  if (year === null) {
    return 'Unknown';
  }

  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatPeriodRange(
  start: number | null,
  end: number | null
): string | null {
  if (start === null && end === null) {
    return null;
  }

  if (start !== null && end !== null) {
    return `${formatYear(start)} - ${formatYear(end)}`;
  }

  if (start !== null) {
    return `From ${formatYear(start)}`;
  }

  return `Until ${formatYear(end)}`;
}

export default async function EmpireChaptersPage({
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
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-8 border-l-4 pl-6"
          style={{ borderColor: empire.color }}
        >
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Chapters
          </p>
          <h1 className="text-4xl font-bold">
            {empire.name} Storytelling Chapters
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Read through the empire in structured chapters, moving from broad
            eras into the events, figures, and turning points that shaped its
            story.
          </p>
        </header>

        <EmpireSectionNav empire={empire} />

        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 lg:sticky lg:top-6 lg:self-start">
            <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">
              Chapter Index
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              {chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}
            </p>

            {chapters.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">
                No chapters found for this empire.
              </p>
            ) : (
              <nav className="mt-5 space-y-2">
                {chapters.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.slug}`}
                    className="block rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                  >
                    <span className="block font-medium text-white">
                      {chapter.title}
                    </span>
                    {formatPeriodRange(
                      chapter.period_start,
                      chapter.period_end
                    ) ? (
                      <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-zinc-500">
                        {formatPeriodRange(
                          chapter.period_start,
                          chapter.period_end
                        )}
                      </span>
                    ) : null}
                  </a>
                ))}
              </nav>
            )}
          </aside>

          <section className="space-y-6">
            {chapters.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 text-zinc-400">
                No chapters are available yet.
              </div>
            ) : (
              chapters.map((chapter) => (
                <article
                  key={chapter.id}
                  id={chapter.slug}
                  className="scroll-mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 md:p-8"
                >
                  <header className="border-b border-zinc-800 pb-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      Chapter {chapter.sort_order}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-white">
                      {chapter.title}
                    </h2>
                    {formatPeriodRange(
                      chapter.period_start,
                      chapter.period_end
                    ) ? (
                      <p className="mt-3 text-sm font-medium text-zinc-400">
                        {formatPeriodRange(
                          chapter.period_start,
                          chapter.period_end
                        )}
                      </p>
                    ) : null}
                  </header>

                  <div className="prose prose-invert mt-6 max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:leading-8 prose-p:text-zinc-300 prose-strong:text-white prose-li:text-zinc-300 prose-a:text-zinc-200">
                    <ReactMarkdown>{chapter.content_md}</ReactMarkdown>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
