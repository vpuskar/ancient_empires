// lib/services/places.ts
// All DB access for the `places` table goes through here.

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '@/lib/errors';

export type PlaceType =
  | 'capital'
  | 'city'
  | 'fort'
  | 'battle_site'
  | 'port'
  | 'other';

export interface Place {
  id: number;
  empire_id: number;
  name: string;
  lat: number;
  lng: number;
  type: PlaceType;
  description: string | null;
  founded_year: number | null;
  abandoned: number | null;
}

export type PlaceInsert = Omit<Place, 'id'>;
export type PlaceUpdate = Partial<PlaceInsert>;

export async function getPlaces(
  client: SupabaseClient,
  empireId: number
): Promise<Place[]> {
  const { data, error } = await client
    .from('places')
    .select('*')
    .eq('empire_id', empireId)
    .order('name', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

export async function getPlacesByType(
  client: SupabaseClient,
  empireId: number,
  type: PlaceType
): Promise<Place[]> {
  const { data, error } = await client
    .from('places')
    .select('*')
    .eq('empire_id', empireId)
    .eq('type', type)
    .order('name', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}

export async function getPlace(
  client: SupabaseClient,
  id: number,
  empireId: number
): Promise<Place> {
  const { data, error } = await client
    .from('places')
    .select('*')
    .eq('id', id)
    .eq('empire_id', empireId)
    .single();

  if (error || !data) throw AppError.notFound('Place');
  return data;
}

export async function createPlace(
  client: SupabaseClient,
  place: PlaceInsert
): Promise<Place> {
  const { data, error } = await client
    .from('places')
    .insert(place)
    .select()
    .single();

  if (error || !data) throw AppError.internal(error?.message);
  return data;
}

export async function updatePlace(
  client: SupabaseClient,
  id: number,
  empireId: number,
  patch: PlaceUpdate
): Promise<Place> {
  const { data, error } = await client
    .from('places')
    .update(patch)
    .eq('id', id)
    .eq('empire_id', empireId)
    .select()
    .single();

  if (error || !data) throw AppError.notFound('Place');
  return data;
}

export async function deletePlace(
  client: SupabaseClient,
  id: number,
  empireId: number
): Promise<void> {
  const { error } = await client
    .from('places')
    .delete()
    .eq('id', id)
    .eq('empire_id', empireId);

  if (error) throw AppError.internal(error.message);
}
