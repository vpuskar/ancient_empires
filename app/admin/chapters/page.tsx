import { getEmpireBySlug } from '@/lib/empires/config';

interface AdminChaptersPageProps {
  searchParams: Promise<{
    empire?: string | string[];
  }>;
}

function getEmpireName(slugParam: string | string[] | undefined) {
  const slug = typeof slugParam === 'string' ? slugParam : 'roman';
  const empire = getEmpireBySlug(slug) ?? getEmpireBySlug('roman');

  return empire?.name ?? 'Roman Empire';
}

export default async function AdminChaptersPage({
  searchParams,
}: AdminChaptersPageProps) {
  const params = await searchParams;
  const empireName = getEmpireName(params.empire);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Chapters &mdash; {empireName}
      </h1>
      <p className="text-neutral-400">Coming in Step 3.</p>
    </div>
  );
}
