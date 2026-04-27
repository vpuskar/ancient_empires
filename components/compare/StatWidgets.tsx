'use client';

import { EMPIRE_CONFIGS } from '@/lib/empires/config';
import type { CompareAggregates } from '@/lib/types/compare';

interface StatWidgetsProps {
  aggregates: CompareAggregates[];
}

type MetricKey =
  | 'ruler_count'
  | 'battle_count'
  | 'event_count'
  | 'peak_area_km2';

type WidgetConfig = {
  title: string;
  key: MetricKey;
  format: (value: number) => string;
};

const widgets: WidgetConfig[] = [
  {
    title: 'Rulers per empire',
    key: 'ruler_count',
    format: (value) => value.toString(),
  },
  {
    title: 'Battles recorded',
    key: 'battle_count',
    format: (value) => value.toString(),
  },
  {
    title: 'Historical events',
    key: 'event_count',
    format: (value) => value.toString(),
  },
  {
    title: 'Peak territory',
    key: 'peak_area_km2',
    format: (value) => `${(value / 1_000_000).toFixed(1)}M km²`,
  },
];

function getAggregate(
  aggregates: CompareAggregates[],
  empireId: number
): CompareAggregates | undefined {
  return aggregates.find((aggregate) => aggregate.empire_id === empireId);
}

function getWidth(value: number, max: number): string {
  if (max <= 0) {
    return '0%';
  }

  return `${(value / max) * 100}%`;
}

export default function StatWidgets({ aggregates }: StatWidgetsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {widgets.map((widget) => {
        const maxValue = Math.max(
          ...aggregates.map((aggregate) => aggregate[widget.key])
        );

        return (
          <section
            key={widget.key}
            className="rounded-lg border border-stone-200 bg-white p-4"
          >
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-600">
              {widget.title}
            </h2>

            <div className="space-y-3">
              {EMPIRE_CONFIGS.map((empire) => {
                const aggregate = getAggregate(aggregates, empire.id);
                const value = aggregate?.[widget.key] ?? 0;

                return (
                  <div key={empire.id} className="flex items-center gap-3">
                    <div className="w-20 text-right text-sm text-stone-700">
                      {empire.name.replace(' Empire', '')}
                    </div>
                    <div className="h-5 flex-1 overflow-hidden rounded bg-stone-100">
                      <div
                        className="h-full rounded-[inherit]"
                        style={{
                          backgroundColor: empire.color,
                          width: getWidth(value, maxValue),
                        }}
                      />
                    </div>
                    <div className="w-16 text-right text-xs text-stone-500">
                      {widget.format(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
