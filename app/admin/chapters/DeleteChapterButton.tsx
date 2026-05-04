'use client';

import { useRouter } from 'next/navigation';

interface DeleteChapterButtonProps {
  chapterId: number;
  chapterTitle: string;
}

export function DeleteChapterButton({
  chapterId,
  chapterTitle,
}: DeleteChapterButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${chapterTitle}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/chapters/${chapterId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      alert('Failed to delete chapter');
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-red-400 hover:text-red-300 text-sm"
    >
      Delete
    </button>
  );
}
