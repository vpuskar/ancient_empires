import type { TimelineEvent } from '@/lib/types/timeline';
import { formatYear } from '@/lib/utils/year';

interface EventCardProps {
  event: TimelineEvent;
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 flex-shrink-0 text-zinc-500"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm leading-snug text-zinc-300">
          <span className="font-semibold text-zinc-400">
            {formatYear(event.year)}:
          </span>{' '}
          {event.title}
        </span>
        <ChevronDownIcon />
      </div>
    </div>
  );
}
