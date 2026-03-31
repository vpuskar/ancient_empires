import { notFound } from 'next/navigation';
import { EmpireSectionNav } from '@/components/navigation/EmpireSectionNav';
import { EmpireOverview } from '@/components/empires/EmpireOverview';
import { getEmpireBySlug } from '@/lib/empires/config';

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

export default async function EmpirePage({
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
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header
          className="mb-8 border-l-4 pl-6 py-2"
          style={{ borderColor: empire.color }}
        >
          <h1 className="mb-2 text-4xl font-bold">{empire.name}</h1>
          <p className="text-lg text-zinc-400">
            {formatYear(empire.start)} - {formatYear(empire.end)}
          </p>
        </header>

        <EmpireSectionNav empire={empire} />

        <EmpireOverview empire={empire} />
      </div>
    </main>
  );
}
