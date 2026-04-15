import { notFound } from 'next/navigation';
import LegacyTimelinePage from '@/components/timeline/LegacyTimelinePage';
import { getEmpireBySlug } from '@/lib/empires/config';
import { JsonLd } from '@/lib/seo/json-ld-script';
import { buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { buildEmpirePageMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/metadata';
import { getEventsWithRulers } from '@/lib/services/events';
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
    'Timeline',
    `${empire.name} timeline — key events from rise to fall. Filter by category, explore by century.`,
    '/timeline'
  );
}

export default async function TimelinePage({
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
  const events = await getEventsWithRulers(supabase, empire.id);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: SITE_URL },
          { name: empire.name, url: `${SITE_URL}/${slug}` },
          { name: 'Timeline', url: `${SITE_URL}/${slug}/timeline` },
        ])}
      />
      <LegacyTimelinePage empire={empire} events={events} />
    </>
  );
}
