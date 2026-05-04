import { AppError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';

export interface QuizQuestion {
  id: number;
  empire_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct: string;
  difficulty: number | null;
  category: string | null;
  explanation: string | null;
  verified: boolean | null;
}

export interface QuizQuestionInsert {
  empire_id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct: string;
  difficulty?: number | null;
  category?: string | null;
  explanation?: string | null;
  verified?: boolean;
}

export interface QuizQuestionUpdate {
  question?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct?: string;
  difficulty?: number | null;
  category?: string | null;
  explanation?: string | null;
  verified?: boolean;
}

export interface QuizSearchParams {
  empireId: number;
  category?: string;
  difficulty?: number;
  verified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface QuizSearchResult {
  questions: QuizQuestion[];
  total: number;
  page: number;
  totalPages: number;
}

function escapeIlikeSearch(value: string) {
  return value.replace(/%/g, '\\%').replace(/_/g, '\\_');
}

export async function searchQuizQuestions(
  params: QuizSearchParams
): Promise<QuizSearchResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 50));
  const offset = (page - 1) * limit;

  let query = supabase
    .from('quiz_questions')
    .select('*', { count: 'exact' })
    .eq('empire_id', params.empireId);

  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.difficulty) {
    query = query.eq('difficulty', params.difficulty);
  }

  if (params.verified !== undefined) {
    query = query.eq('verified', params.verified);
  }

  const search = params.search?.trim();

  if (search) {
    query = query.ilike('question', `%${escapeIlikeSearch(search)}%`);
  }

  const { data, count, error } = await query
    .order('id', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw AppError.internal(error.message);

  const total = count ?? 0;

  return {
    questions: data ?? [],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getQuizQuestionById(
  id: number
): Promise<QuizQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw AppError.internal(error.message);
  }

  return data;
}

export async function createQuizQuestion(
  data: QuizQuestionInsert
): Promise<QuizQuestion> {
  const supabase = await createClient();
  const { data: question, error } = await supabase
    .from('quiz_questions')
    .insert(data)
    .select('*')
    .single();

  if (error || !question) throw AppError.internal(error?.message);
  return question;
}

export async function updateQuizQuestion(
  id: number,
  data: QuizQuestionUpdate
): Promise<QuizQuestion> {
  const supabase = await createClient();
  const { data: question, error } = await supabase
    .from('quiz_questions')
    .update(data)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !question) throw AppError.internal(error?.message);
  return question;
}

export async function deleteQuizQuestion(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('quiz_questions').delete().eq('id', id);

  if (error) throw AppError.internal(error.message);
}
