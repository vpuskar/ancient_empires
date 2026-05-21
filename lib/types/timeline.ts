export interface TimelineEvent {
  id: number;
  year: number;
  title: string;
  description: string | null;
  category: string | null;
  significance: number;
  ruler_id: number | null;
  ruler_name: string | null;
  is_featured: boolean;
}

export interface TimelineChapter {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  period_start: number | null;
  period_end: number | null;
  hero_image_url: string | null;
  sort_order: number;
  events: TimelineEvent[];
}

export interface TimelineData {
  chapters: TimelineChapter[];
}
