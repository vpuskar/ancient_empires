import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getQuizConfig } from '@/lib/services/quiz';
import { QuizGame } from './_components/QuizGame';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}): Promise<Metadata> {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    return {
      title: 'Quiz | Ancient Empires',
    };
  }

  return {
    title: `Quiz \u2014 ${empire.name} | Ancient Empires`,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  const config = await getQuizConfig(empire.id);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#120C08_0%,#1A1210_48%,#0D0A07_100%)] px-4 py-8 text-[#F5E6C8] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <QuizGame empire={empire} config={config} />
      </div>
    </main>
  );
}
