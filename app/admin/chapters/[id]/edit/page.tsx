import { notFound } from 'next/navigation';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';
import { getChapterById } from '@/lib/services/chapters';
import { ChapterForm } from '../../ChapterForm';

interface EditChapterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditChapterPage({
  params,
}: EditChapterPageProps) {
  const { id } = await params;
  const chapterId = Number(id);

  if (!Number.isInteger(chapterId) || chapterId <= 0) {
    notFound();
  }

  const chapter = await getChapterById(chapterId);

  if (!chapter) {
    notFound();
  }

  const empire =
    EMPIRE_CONFIGS.find((config) => config.id === chapter.empire_id) ??
    EMPIRE_CONFIGS[0];

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">
        Edit Chapter &mdash; {chapter.title}
      </h1>
      <ChapterForm
        mode="edit"
        empireSlug={empire.slug}
        empireId={chapter.empire_id}
        initialData={chapter}
      />
    </div>
  );
}
