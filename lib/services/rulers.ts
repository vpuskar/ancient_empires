// lib/services/rulers.ts
// All DB access for the `rulers` table goes through here.
// Negative integers = BC dates (-117 → 117 BC).

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '@/lib/errors';

export interface Ruler {
  id: number;
  empire_id: number;
  name: string;
  born: number | null;
  died: number | null;
  reign_start: number;
  reign_end: number | null;
  bio: string | null;
  personality_type: string | null;
  image_url: string | null;
}

export type RulerInsert = Omit<Ruler, 'id'>;
export type RulerUpdate = Partial<RulerInsert>;

export async function getRulers(
  client: SupabaseClient,
  empireId: number
): Promise<Ruler[]> {
  const { data, error } = await client
    .from('rulers')
    .select('*')
    .eq('empire_id', empireId)
    .order('reign_start', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

export async function getRuler(
  client: SupabaseClient,
  id: number,
  empireId: number
): Promise<Ruler> {
  const { data, error } = await client
    .from('rulers')
    .select('*')
    .eq('id', id)
    .eq('empire_id', empireId)
    .single();

  if (error || !data) throw AppError.notFound('Ruler');
  return data;
}

export async function createRuler(
  client: SupabaseClient,
  ruler: RulerInsert
): Promise<Ruler> {
  const { data, error } = await client
    .from('rulers')
    .insert(ruler)
    .select()
    .single();

  if (error || !data) throw AppError.internal(error?.message);
  return data;
}

export async function updateRuler(
  client: SupabaseClient,
  id: number,
  empireId: number,
  patch: RulerUpdate
): Promise<Ruler> {
  const { data, error } = await client
    .from('rulers')
    .update(patch)
    .eq('id', id)
    .eq('empire_id', empireId)
    .select()
    .single();

  if (error || !data) throw AppError.notFound('Ruler');
  return data;
}

export async function deleteRuler(
  client: SupabaseClient,
  id: number,
  empireId: number
): Promise<void> {
  const { error } = await client
    .from('rulers')
    .delete()
    .eq('id', id)
    .eq('empire_id', empireId);

  if (error) throw AppError.internal(error.message);
}
