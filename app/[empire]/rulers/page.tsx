import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getRulers } from '@/lib/services/rulers';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 86400;

function formatYear(year: number | null): string {
  if (year === null) {
    return 'Unknown';
  }

  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

function formatReign(start: number, end: number | null): string {
  return `${formatYear(start)} - ${formatYear(end)}`;
}

export default async function RulersPage({
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
  const rulers = await getRulers(supabase, empire.id);

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-l-4 pl-6" style={{ borderColor: empire.color }}>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zinc-500">
            Rulers Encyclopaedia
          </p>
          <h1 className="text-4xl font-bold">{empire.name} Rulers</h1>
          <p className="mt-3 text-zinc-400">
            A chronological list of rulers for the {empire.name}.
          </p>
        </header>

        <section className="space-y-4">
          {rulers.map((ruler) => (
            <article
              key={ruler.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{ruler.name}</h2>
                  {ruler.native_name ? (
                    <p className="mt-1 text-sm italic text-zinc-400">{ruler.native_name}</p>
                  ) : null}
                </div>

                <p className="text-sm font-medium text-zinc-300">
                  {formatReign(ruler.reign_start, ruler.reign_end)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-300">
                {ruler.dynasty ? (
                  <span className="rounded-full border border-zinc-700 px-3 py-1">
                    {ruler.dynasty}
                  </span>
                ) : null}
              </div>

              <p className="mt-4 max-w-3xl leading-7 text-zinc-300">
                {ruler.bio_short ?? 'No biography available.'}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
