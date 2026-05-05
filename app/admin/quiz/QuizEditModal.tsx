'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { QuizQuestion } from '@/lib/services/quiz-admin';

interface QuizEditModalProps {
  mode: 'create' | 'edit';
  empireId: number;
  question?: QuizQuestion;
  onClose: () => void;
  onSaved: () => void;
  onDeleted?: () => void;
}

const categories = [
  'culture',
  'politics',
  'rulers',
  'religion',
  'geography',
  'battles',
] as const;

export function QuizEditModal({
  mode,
  empireId,
  question,
  onClose,
  onSaved,
  onDeleted,
}: QuizEditModalProps) {
  const [questionText, setQuestionText] = useState(question?.question ?? '');
  const [optionA, setOptionA] = useState(question?.option_a ?? '');
  const [optionB, setOptionB] = useState(question?.option_b ?? '');
  const [optionC, setOptionC] = useState(question?.option_c ?? '');
  const [optionD, setOptionD] = useState(question?.option_d ?? '');
  const [correct, setCorrect] = useState(question?.correct ?? 'A');
  const [category, setCategory] = useState(question?.category ?? 'culture');
  const [difficulty, setDifficulty] = useState(
    String(question?.difficulty ?? 2)
  );
  const [explanation, setExplanation] = useState(question?.explanation ?? '');
  const [verified, setVerified] = useState(question?.verified ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => window.removeEventListener('keydown', handleKeydown);
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...(mode === 'create' ? { empire_id: empireId } : {}),
      question: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct,
      category,
      difficulty: Number(difficulty),
      explanation: explanation.trim() === '' ? null : explanation,
      verified,
    };

    try {
      const response = await fetch(
        mode === 'create'
          ? '/api/admin/quiz'
          : `/api/admin/quiz/${question?.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        setError('Failed to save question');
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError('Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!question) {
      return;
    }

    const confirmed = window.confirm(
      'Delete this question? This cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/quiz/${question.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      alert('Failed to delete question');
      return;
    }

    onDeleted?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-100"
          aria-label="Close modal"
        >
          X
        </button>

        <h2 className="mb-4 text-xl font-semibold">
          {mode === 'create' ? 'Add Question' : 'Edit Question'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Question
            </span>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 font-mono text-sm"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Option A
            </span>
            <input
              type="text"
              required
              value={optionA}
              onChange={(event) => setOptionA(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Option B
            </span>
            <input
              type="text"
              required
              value={optionB}
              onChange={(event) => setOptionB(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Option C
            </span>
            <input
              type="text"
              required
              value={optionC}
              onChange={(event) => setOptionC(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Option D
            </span>
            <input
              type="text"
              required
              value={optionD}
              onChange={(event) => setOptionD(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Correct Answer
            </span>
            <select
              required
              value={correct}
              onChange={(event) => setCorrect(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Category
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Difficulty
            </span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Explanation
            </span>
            <textarea
              rows={2}
              value={explanation}
              onChange={(event) => setExplanation(event.target.value)}
              className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100 font-mono text-sm"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={verified}
              onChange={(event) => setVerified(event.target.checked)}
            />
            <span className="text-sm font-medium text-neutral-300">
              Mark as verified
            </span>
          </label>

          {error ? <p className="text-red-400 text-sm mt-2">{error}</p> : null}

          <div className="flex justify-between items-center mt-4">
            <div>
              {mode === 'edit' ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-300 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 disabled:opacity-50 text-sm"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
