import type { TimelineEvent } from '@/lib/services/events';

export interface NormalizedTimelineEvent {
  source: TimelineEvent;
  id: string | number;
  year: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  significance: number;
  rulerName: string | null;
  rulerImageUrl: string | null;
}

const KNOWN_CATEGORIES = new Set([
  'political',
  'military',
  'cultural',
  'religious',
  'economic',
  'natural',
]);

export function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : fallback;
}

export function titleCase(value: unknown, fallback = 'Unknown'): string {
  const text = safeString(value, fallback);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getInitial(value: unknown, fallback = '?'): string {
  const text = safeString(value, fallback);
  return text.charAt(0).toUpperCase();
}

export function getCategoryKey(value: unknown): string {
  const category = safeString(value, 'unknown').toLowerCase();
  return KNOWN_CATEGORIES.has(category) ? category : 'unknown';
}

export function formatCategoryLabel(value: unknown): string {
  const category = getCategoryKey(value);
  if (category === 'unknown') return 'Unknown';

  return category
    .split('_')
    .map((part) => titleCase(part))
    .join(' ');
}

export function normalizeTimelineEvents(
  events: TimelineEvent[]
): NormalizedTimelineEvent[] {
  return events.map((event, index) => {
    const title = safeString(event.name, 'Untitled event');
    const year = Number.isFinite(event.year) ? event.year : 0;
    const category = getCategoryKey(event.category);
    const description = safeString(
      event.description,
      'No description available.'
    );
    const significance = Number.isFinite(event.significance)
      ? event.significance
      : 3;
    const rulerImageUrl = safeString(event.ruler?.image_url, '');
    const imageUrl = safeString(
      (event as TimelineEvent & { image_url?: unknown }).image_url,
      ''
    );

    return {
      source: event,
      id: event.id ?? `${index}-${year}-${title}`,
      year,
      title,
      category,
      description,
      imageUrl: imageUrl || null,
      significance,
      rulerName: safeString(event.ruler?.name, '') || null,
      rulerImageUrl: rulerImageUrl || null,
    };
  });
}
