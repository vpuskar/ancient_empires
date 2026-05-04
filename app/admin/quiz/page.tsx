import { EMPIRE_CONFIGS, getEmpireBySlug } from '@/lib/empires/config';
import { QuizManager } from './QuizManager';

interface AdminQuizPageProps {
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

export default async function AdminQuizPage({
  searchParams,
}: AdminQuizPageProps) {
  const params = await searchParams;
  const { empire, slug } = getSelectedEmpire(params.empire);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">
        Quiz Questions &mdash; {empire.name}
      </h1>
      <QuizManager empireId={empire.id} empireSlug={slug} />
    </div>
  );
}
