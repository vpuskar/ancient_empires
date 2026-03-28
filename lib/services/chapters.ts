// lib/services/chapters.ts
// All DB access for the `chapters` table goes through here.
// Negative integers represent BC dates (-27 becomes 27 BC).

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '@/lib/errors';

export interface Chapter {
  id: number;
  empire_id: number;
  slug: string;
  title: string;
  sort_order: number;
  content_md: string;
  period_start: number | null;
  period_end: number | null;
  updated_at: string;
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
