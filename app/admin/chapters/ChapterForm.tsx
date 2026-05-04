'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

interface ChapterFormProps {
  mode: 'create' | 'edit';
  empireSlug: string;
  empireId: number;
  initialData?: {
    id: number;
    slug: string;
    title: string;
    sort_order: number;
    content_md: string;
    period_start: number | null;
    period_end: number | null;
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseOptionalNumber(value: string) {
  if (value.trim() === '') {
    return null;
  }

  return Number(value);
}

export function ChapterForm({
  mode,
  empireSlug,
  empireId,
  initialData,
}: ChapterFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [sortOrder, setSortOrder] = useState(
    String(initialData?.sort_order ?? 0)
  );
  const [periodStart, setPeriodStart] = useState(
    initialData?.period_start?.toString() ?? ''
  );
  const [periodEnd, setPeriodEnd] = useState(
    initialData?.period_end?.toString() ?? ''
  );
  const [contentMd, setContentMd] = useState(initialData?.content_md ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleBlur = () => {
    if (mode === 'create' && slug.trim() === '') {
      setSlug(slugify(title));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...(mode === 'create' ? { empire_id: empireId } : {}),
      slug,
      title,
      sort_order: Number(sortOrder),
      content_md: contentMd,
      period_start: parseOptionalNumber(periodStart),
      period_end: parseOptionalNumber(periodEnd),
    };

    try {
      const response = await fetch(
        mode === 'create'
          ? '/api/admin/chapters'
          : `/api/admin/chapters/${initialData?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setError('Failed to save chapter');
        return;
      }

      router.push(`/admin/chapters?empire=${encodeURIComponent(empireSlug)}`);
    } catch {
      setError('Failed to save chapter');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-300">Title</span>
        <input
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={handleTitleBlur}
          className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-300">Slug</span>
        <input
          type="text"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-300">Sort Order</span>
        <input
          type="number"
          required
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 max-w-[200px]"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-300">
          Period Start
        </span>
        <input
          type="number"
          value={periodStart}
          onChange={(event) => setPeriodStart(event.target.value)}
          placeholder="e.g. -753 for 753 BC"
          className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 max-w-[200px]"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-300">Period End</span>
        <input
          type="number"
          value={periodEnd}
          onChange={(event) => setPeriodEnd(event.target.value)}
          placeholder="e.g. 476"
          className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 max-w-[200px]"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-300">
          Content (Markdown)
        </span>
        <textarea
          required
          rows={20}
          value={contentMd}
          onChange={(event) => setContentMd(event.target.value)}
          className="w-full p-3 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 font-mono text-sm"
        />
      </label>

      {error ? <p className="text-red-400 text-sm">{error}</p> : null}

      <div className="flex gap-3 items-center">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 rounded bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 disabled:opacity-50 text-sm"
        >
          {isSaving ? 'Saving...' : 'Save Chapter'}
        </button>
        <Link
          href={`/admin/chapters?empire=${encodeURIComponent(empireSlug)}`}
          className="text-neutral-400 hover:text-neutral-300 text-sm"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
