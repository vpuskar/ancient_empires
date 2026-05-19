import type { TimelineEvent } from '@/lib/types/timeline';

export interface EventCluster {
  anchor: TimelineEvent;
  cluster: TimelineEvent[];
}

export interface ChapterDisplay {
  prelude: TimelineEvent[];
  clusters: EventCluster[];
}

export function organizeChapterEvents(events: TimelineEvent[]): ChapterDisplay {
  const sortedEvents = [...events]
    .filter((event) => event.significance >= 3)
    .sort((a, b) => a.year - b.year || a.id - b.id);

  const prelude: TimelineEvent[] = [];
  const clusters: EventCluster[] = [];
  let currentCluster: EventCluster | null = null;

  for (const event of sortedEvents) {
    if (event.significance === 5) {
      currentCluster = {
        anchor: event,
        cluster: [],
      };
      clusters.push(currentCluster);
      continue;
    }

    if (currentCluster) {
      currentCluster.cluster.push(event);
    } else {
      prelude.push(event);
    }
  }

  return { prelude, clusters };
}
