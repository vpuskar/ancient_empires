'use client';

import type { EmpireConfig } from '@/lib/empires/config';
import type { Ruler } from '@/lib/services/rulers';
import { RulersEncyclopaedia } from './RulersEncyclopaedia';

interface LegacyRulersPageProps {
  empire: EmpireConfig;
  rulers: Ruler[];
}

export default function LegacyRulersPage({
  empire,
  rulers,
}: LegacyRulersPageProps) {
  return <RulersEncyclopaedia empire={empire} rulers={rulers} />;
}
