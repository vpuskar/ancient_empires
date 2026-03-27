import { createClient } from '@/lib/supabase/client';
import { AppError } from '@/lib/errors';

export interface EmpireStats {
  rulers: number;
  places: number;
  battles: number;
  quizQuestions: number;
  events: number;
}

export async function getEmpireStats(empireId: number): Promise<EmpireStats> {
  const supabase = createClient();

  const [rulers, places, battles, quiz, events] = await Promise.all([
    supabase
      .from('rulers')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('places')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('battles')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('quiz_questions')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('empire_id', empireId),
  ]);

  const results = [rulers, places, battles, quiz, events];
  const errorResult = results.find((r) => r.error);
  if (errorResult?.error) {
    throw new AppError(errorResult.error.message, 'STATS_FETCH', 500);
  }

  return {
    rulers: rulers.count ?? 0,
    places: places.count ?? 0,
    battles: battles.count ?? 0,
    quizQuestions: quiz.count ?? 0,
    events: events.count ?? 0,
  };
}

export async function getGlobalStats(): Promise<
  EmpireStats & { empires: number }
> {
  const supabase = createClient();

  const [empires, rulers, places, battles, quiz, events] = await Promise.all([
    supabase.from('empires').select('id', { count: 'exact', head: true }),
    supabase.from('rulers').select('id', { count: 'exact', head: true }),
    supabase.from('places').select('id', { count: 'exact', head: true }),
    supabase.from('battles').select('id', { count: 'exact', head: true }),
    supabase
      .from('quiz_questions')
      .select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
  ]);

  return {
    empires: empires.count ?? 0,
    rulers: rulers.count ?? 0,
    places: places.count ?? 0,
    battles: battles.count ?? 0,
    quizQuestions: quiz.count ?? 0,
    events: events.count ?? 0,
  };
}
