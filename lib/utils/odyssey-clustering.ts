import type { TimelineEvent } from '@/lib/types/timeline';

export interface EventCluster {
  anchor: TimelineEvent;
  cluster: TimelineEvent[];
}

export interface ChapterDisplay {
  prelude: TimelineEvent[];
  clusters: EventCluster[];
}

/**
 * Organizes a chapter around a single featured anchor: the first sig-5 event.
 * Earlier sig-3/4 events become the prelude; every later displayable event
 * clusters under that anchor.
 */
export function organizeChapterEvents(events: TimelineEvent[]): ChapterDisplay {
  const sortedEvents = [...events]
    .filter((event) => event.significance >= 3)
    .sort((a, b) => a.year - b.year || a.id - b.id);

  const anchorIndex = sortedEvents.findIndex(
    (event) => event.significance === 5
  );

  if (anchorIndex === -1) {
    return {
      prelude: sortedEvents,
      clusters: [],
    };
  }

  const prelude = sortedEvents.slice(0, anchorIndex);
  const anchor = sortedEvents[anchorIndex];
  const cluster = sortedEvents.slice(anchorIndex + 1);

  return {
    prelude,
    clusters: [{ anchor, cluster }],
  };
}
