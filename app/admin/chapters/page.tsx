import Link from 'next/link';
import { EMPIRE_CONFIGS, getEmpireBySlug } from '@/lib/empires/config';
import { getChaptersByEmpire } from '@/lib/services/chapters';
import { DeleteChapterButton } from './DeleteChapterButton';

interface AdminChaptersPageProps {
  searchParams: Promise<{
    empire?: string | string[];
  }>;
}

function getSelectedEmpire(slugParam: string | string[] | undefined) {
  const slug = typeof slugParam === 'string' ? slugParam : 'roman';
  const empire = getEmpireBySlug(slug) ?? getEmpireBySlug('roman');
  const fallbackEmpire = EMPIRE_CONFIGS[0];

  return {
    empire: empire ?? fallbackEmpire,
    slug: empire?.slug ?? 'roman',
  };
}

function formatYear(year: number | null) {
  if (year === null) {
    return <span>&mdash;</span>;
  }

  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }

  return `${year} AD`;
}

function formatPeriod(start: number | null, end: number | null) {
  if (start === null && end === null) {
    return <span>&mdash;</span>;
  }

  return (
    <>
      {formatYear(start)} <span>&ndash;</span> {formatYear(end)}
    </>
  );
}

export default async function AdminChaptersPage({
  searchParams,
}: AdminChaptersPageProps) {
  const params = await searchParams;
  const { empire, slug } = getSelectedEmpire(params.empire);
  const chapters = await getChaptersByEmpire(empire.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold mb-2">
          Chapters &mdash; {empire.name}
        </h1>
        <Link
          href={`/admin/chapters/new?empire=${encodeURIComponent(slug)}`}
          className="px-4 py-2 rounded bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 text-sm"
        >
          Add Chapter
        </Link>
      </div>

      {chapters.length === 0 ? (
        <p className="text-neutral-400">No chapters found for this empire.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="py-2 px-3 font-medium">Sort Order</th>
              <th className="py-2 px-3 font-medium">Title</th>
              <th className="py-2 px-3 font-medium">Slug</th>
              <th className="py-2 px-3 font-medium">Period</th>
              <th className="py-2 px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((chapter) => (
              <tr key={chapter.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-3 border-b border-neutral-800/50">
                  {chapter.sort_order}
                </td>
                <td className="py-3 px-3 border-b border-neutral-800/50">
                  {chapter.title}
                </td>
                <td className="py-3 px-3 border-b border-neutral-800/50">
                  {chapter.slug}
                </td>
                <td className="py-3 px-3 border-b border-neutral-800/50">
                  {formatPeriod(chapter.period_start, chapter.period_end)}
                </td>
                <td className="py-3 px-3 border-b border-neutral-800/50">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/chapters/${chapter.id}/edit`}
                      className="text-neutral-300 hover:text-neutral-100 underline text-sm"
                    >
                      Edit
                    </Link>
                    <DeleteChapterButton
                      chapterId={chapter.id}
                      chapterTitle={chapter.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
