// lib/services/events.ts
// All DB access for the `events` table goes through here.
// Negative integers represent BC dates (-117 becomes 117 BC).

import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '@/lib/errors';

export interface TimelineEvent {
  id: number;
  empire_id: number;
  name: string;
  year: number;
  description: string | null;
  category: 'political' | 'military' | 'cultural' | 'religious';
  significance: number;
  ruler_id: number | null;
  ruler: {
    name: string;
    image_url: string | null;
  } | null;
}

export async function getEventsWithRulers(
  client: SupabaseClient,
  empireId: number
): Promise<TimelineEvent[]> {
  const { data, error } = await client
    .from('events')
    .select('*, ruler:rulers(name, image_url)')
    .eq('empire_id', empireId)
    .order('year', { ascending: true });

  if (error) throw AppError.internal(error.message);
  return data ?? [];
}
