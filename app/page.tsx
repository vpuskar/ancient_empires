import AncientEmpiresLanding from '@/components/home/AncientEmpiresLanding';
import { JsonLd } from '@/lib/seo/json-ld-script';
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';

export function generateMetadata() {
  return buildMetadata({
    title: 'Ancient Empires — Interactive History Platform',
    description:
      "Explore four of history's greatest civilisations through interactive maps, timelines, quizzes, and storytelling.",
    path: '/',
    rawTitle: true,
  });
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildWebSiteJsonLd()} />
      <AncientEmpiresLanding />
    </>
  );
}
