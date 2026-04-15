import { notFound } from 'next/navigation';
import LegacyRulersPage from '@/components/rulers/LegacyRulersPage';
import { getEmpireBySlug } from '@/lib/empires/config';
import { JsonLd } from '@/lib/seo/json-ld-script';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildEmpirePageMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/metadata';
import { getRulers } from '@/lib/services/rulers';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ empire: string }>;
}) {
  const { empire: slug } = await params;
  const empire = getEmpireBySlug(slug);

  if (!empire) {
    return {};
  }

  return buildEmpirePageMetadata(
    empire.name,
    slug,
    'Rulers',
    `Browse all rulers of the ${empire.name} — from founding to fall. Filter by dynasty, search by name.`,
    '/rulers'
  );
}

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

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: SITE_URL },
          { name: empire.name, url: `${SITE_URL}/${slug}` },
          { name: 'Rulers', url: `${SITE_URL}/${slug}/rulers` },
        ])}
      />
      <LegacyRulersPage empire={empire} rulers={rulers} />
    </>
  );
}
