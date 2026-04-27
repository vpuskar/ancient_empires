import CompareCanvas from '@/components/compare/CompareCanvas';
import { buildMetadata } from '@/lib/seo/metadata';
import { getCompareData } from '@/lib/services/compare';

export const revalidate = 3600;

const description =
  'Compare Roman, Chinese, Japanese, and Ottoman empires across territory, rulers, battles, and legacy.';

export function generateMetadata() {
  return buildMetadata({
    title: 'Compare Empires — Ancient Empires',
    description,
    path: '/compare',
    rawTitle: true,
  });
}

export default async function ComparePage() {
  const data = await getCompareData();

  return <CompareCanvas data={data} />;
}
