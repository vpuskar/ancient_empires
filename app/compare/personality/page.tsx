import CrossPersonalityQuiz from '@/components/compare/CrossPersonalityQuiz';
import { buildMetadata } from '@/lib/seo/metadata';

export const dynamic = 'force-static';

const description =
  'Take the cross-empire personality quiz and discover which of the four great empires — Roman, Chinese, Japanese, or Ottoman — would claim you.';

export function generateMetadata() {
  return buildMetadata({
    title: 'Which Empire Claims You?',
    description,
    path: '/compare/personality',
  });
}

export default function ComparePersonalityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <CrossPersonalityQuiz />
    </main>
  );
}
