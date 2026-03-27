import { notFound } from 'next/navigation';
import { RulersEncyclopaedia } from '@/components/rulers/RulersEncyclopaedia';
import { getEmpireBySlug } from '@/lib/empires/config';
import { getRulers } from '@/lib/services/rulers';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 86400;

export default async function RulersPage({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    notFound();
  }

  const supabase = await createClient();
  const rulers = await getRulers(supabase, empire.id);

  return <RulersEncyclopaedia empire={empire} rulers={rulers} />;
}
