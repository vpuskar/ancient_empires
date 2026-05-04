// lib/services/chapters.ts
// All DB access for the `chapters` table goes through here.
// Negative integers represent BC dates (-27 becomes 27 BC).

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '@/lib/errors';
import { createClient } from '@/lib/supabase/server';

export interface Chapter {
  id: number;
  empire_id: number;
  slug: string;
  title: string;
  sort_order: number;
  content_md: string;
  period_start: number | null;
  period_end: number | null;
  updated_at: string | null;
}

export interface ChapterInsert {
  empire_id: number;
  slug: string;
  title: string;
  sort_order: number;
  content_md: string;
  period_start?: number | null;
  period_end?: number | null;
}

export interface ChapterUpdate {
  slug?: string;
  title?: string;
  sort_order?: number;
  content_md?: string;
  period_start?: number | null;
  period_end?: number | null;
}

export async function getChapters(
  client: SupabaseClient,
  empireId: number
): Promise<Chapter[]> {
  const { data, error } = await client
    .from('chapters')
    .select(
      'id, empire_id, slug, title, sort_order, content_md, period_start, period_end, updated_at'
    )
    .eq('empire_id', empireId)
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

export async function getChapterBySlug(
  client: SupabaseClient,
  empireId: number,
  slug: string
): Promise<Chapter | null> {
  const { data, error } = await client
    .from('chapters')
    .select(
      'id, empire_id, slug, title, sort_order, content_md, period_start, period_end, updated_at'
    )
    .eq('empire_id', empireId)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw AppError.internal(error.message);
  }
  return data;
}

export async function getChaptersByEmpire(
  empireId: number
): Promise<Chapter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('empire_id', empireId)
    .order('sort_order', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

export async function getChapterById(id: number): Promise<Chapter | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw AppError.internal(error.message);
  }

  return data;
}

export async function createChapter(data: ChapterInsert): Promise<Chapter> {
  const supabase = await createClient();
  const { data: chapter, error } = await supabase
    .from('chapters')
    .insert(data)
    .select('*')
    .single();

  if (error || !chapter) throw AppError.internal(error?.message);
  return chapter;
}

export async function updateChapter(
  id: number,
  data: ChapterUpdate
): Promise<Chapter> {
  const supabase = await createClient();
  const { data: chapter, error } = await supabase
    .from('chapters')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error || !chapter) throw AppError.internal(error?.message);
  return chapter;
}

export async function deleteChapter(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('chapters').delete().eq('id', id);

  if (error) throw AppError.internal(error.message);
}
