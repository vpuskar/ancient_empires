// lib/services/quiz.ts
// All DB access for the `quiz_questions` table goes through here.

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '@/lib/errors';

export type Difficulty = 1 | 2 | 3;

export interface QuizQuestion {
  id: number;
  empire_id: number;
  question: string;
  options: string[];
  correct_answer: number; // index into options[]
  difficulty: Difficulty;
  category: string;
}

export type QuizQuestionInsert = Omit<QuizQuestion, 'id'>;
export type QuizQuestionUpdate = Partial<QuizQuestionInsert>;

export async function getQuizQuestions(
  client: SupabaseClient,
  empireId: number
): Promise<QuizQuestion[]> {
  const { data, error } = await client
    .from('quiz_questions')
    .select('*')
    .eq('empire_id', empireId)
    .order('difficulty', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

export async function getQuizQuestionsByDifficulty(
  client: SupabaseClient,
  empireId: number,
  difficulty: Difficulty
): Promise<QuizQuestion[]> {
  const { data, error } = await client
    .from('quiz_questions')
    .select('*')
    .eq('empire_id', empireId)
    .eq('difficulty', difficulty);

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

/** Returns `count` random questions for a given empire, optionally filtered by difficulty. */
export async function getRandomQuizQuestions(
  client: SupabaseClient,
  empireId: number,
  count: number,
  difficulty?: Difficulty
): Promise<QuizQuestion[]> {
  let query = client
    .from('quiz_questions')
    .select('*')
    .eq('empire_id', empireId);

  if (difficulty !== undefined) {
    query = query.eq('difficulty', difficulty);
  }

  const { data, error } = await query;
  if (error) throw AppError.internal(error.message);

  const pool = data ?? [];
  // Fisher-Yates shuffle, then slice
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export async function getQuizQuestion(
  client: SupabaseClient,
  id: number,
  empireId: number
): Promise<QuizQuestion> {
  const { data, error } = await client
    .from('quiz_questions')
    .select('*')
    .eq('id', id)
    .eq('empire_id', empireId)
    .single();

  if (error || !data) throw AppError.notFound('QuizQuestion');
  return data;
}

export async function createQuizQuestion(
  client: SupabaseClient,
  question: QuizQuestionInsert
): Promise<QuizQuestion> {
  const { data, error } = await client
    .from('quiz_questions')
    .insert(question)
    .select()
    .single();

  if (error || !data) throw AppError.internal(error?.message);
  return data;
}

export async function updateQuizQuestion(
  client: SupabaseClient,
  id: number,
  empireId: number,
  patch: QuizQuestionUpdate
): Promise<QuizQuestion> {
  const { data, error } = await client
    .from('quiz_questions')
    .update(patch)
    .eq('id', id)
    .eq('empire_id', empireId)
    .select()
    .single();

  if (error || !data) throw AppError.notFound('QuizQuestion');
  return data;
}

export async function deleteQuizQuestion(
  client: SupabaseClient,
  id: number,
  empireId: number
): Promise<void> {
  const { error } = await client
    .from('quiz_questions')
    .delete()
    .eq('id', id)
    .eq('empire_id', empireId);

  if (error) throw AppError.internal(error.message);
}
