'use client';

import { useEffect, useMemo, useState } from 'react';
import type { QuizQuestion, QuizSearchResult } from '@/lib/services/quiz-admin';
import { QuizEditModal } from './QuizEditModal';

interface QuizManagerProps {
  empireId: number;
  empireSlug: string;
}

const categories = [
  'culture',
  'politics',
  'rulers',
  'religion',
  'geography',
  'battles',
] as const;

function truncateQuestion(question: string) {
  if (question.length <= 80) {
    return question;
  }

  return `${question.slice(0, 77)}...`;
}

export function QuizManager({ empireId }: QuizManagerProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [verified, setVerified] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setCategory('');
    setDifficulty('');
    setVerified('');
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  }, [empireId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, difficulty, verified, debouncedSearch]);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchQuestions() {
      setLoading(true);

      const params = new URLSearchParams({
        empire_id: String(empireId),
        page: String(page),
        limit: '50',
      });

      if (category) {
        params.set('category', category);
      }

      if (difficulty) {
        params.set('difficulty', difficulty);
      }

      if (verified) {
        params.set('verified', verified);
      }

      if (debouncedSearch.trim()) {
        params.set('search', debouncedSearch.trim());
      }

      try {
        const response = await fetch(`/api/admin/quiz?${params.toString()}`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          return;
        }

        const result = (await response.json()) as QuizSearchResult;
        setQuestions(result.questions);
        setTotal(result.total);
        setPage(result.page);
        setTotalPages(result.totalPages);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Failed to fetch quiz questions:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchQuestions();

    return () => abortController.abort();
  }, [
    empireId,
    category,
    difficulty,
    verified,
    debouncedSearch,
    page,
    refreshKey,
  ]);

  const range = useMemo(() => {
    if (total === 0) {
      return { start: 0, end: 0 };
    }

    const start = (page - 1) * 50 + 1;
    const end = Math.min(page * 50, total);

    return { start, end };
  }, [page, total]);

  const closeModal = () => {
    setEditingQuestion(null);
    setIsCreating(false);
  };

  const refreshResults = () => {
    closeModal();
    setRefreshKey((current) => current + 1);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
          className="p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 text-sm"
        >
          <option value="">All Difficulties</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select
          value={verified}
          onChange={(event) => setVerified(event.target.value)}
          className="p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 text-sm"
        >
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search questions..."
          className="p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 text-sm min-w-[200px]"
        />

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 text-sm"
        >
          Add Question
        </button>
      </div>

      <div className="text-sm text-neutral-400 mb-2">
        Showing {range.start}&ndash;{range.end} of {total} questions
        {loading ? <span className="ml-3">Loading...</span> : null}
      </div>

      <div className={loading ? 'opacity-50' : ''}>
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="py-2 px-3 font-medium">ID</th>
              <th className="py-2 px-3 font-medium">Question</th>
              <th className="py-2 px-3 font-medium">Category</th>
              <th className="py-2 px-3 font-medium">Difficulty</th>
              <th className="py-2 px-3 font-medium">Correct</th>
              <th className="py-2 px-3 font-medium">Verified</th>
              <th className="py-2 px-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr
                key={question.id}
                onClick={() => setEditingQuestion(question)}
                className="hover:bg-neutral-900/50 cursor-pointer"
              >
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  {question.id}
                </td>
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  {truncateQuestion(question.question)}
                </td>
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  {question.category ?? 'none'}
                </td>
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  {question.difficulty ?? 'none'}
                </td>
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  {question.correct}
                </td>
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  {question.verified ? (
                    <span>&#10003;</span>
                  ) : (
                    <span>&#10007;</span>
                  )}
                </td>
                <td className="py-2 px-3 border-b border-neutral-800/50">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingQuestion(question);
                    }}
                    className="text-neutral-300 hover:text-neutral-100 underline text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="px-3 py-1 rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 text-sm"
        >
          Previous
        </button>

        <div className="text-sm text-neutral-400">
          Page {page} of {Math.max(1, totalPages)}
        </div>

        <button
          type="button"
          disabled={totalPages === 0 || page >= totalPages}
          onClick={() => setPage((current) => current + 1)}
          className="px-3 py-1 rounded border border-neutral-700 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 text-sm"
        >
          Next
        </button>
      </div>

      {editingQuestion || isCreating ? (
        <QuizEditModal
          mode={isCreating ? 'create' : 'edit'}
          empireId={empireId}
          question={editingQuestion ?? undefined}
          onClose={closeModal}
          onSaved={refreshResults}
          onDeleted={refreshResults}
        />
      ) : null}
    </div>
  );
}
