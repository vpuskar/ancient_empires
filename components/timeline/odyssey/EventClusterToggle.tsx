'use client';

import { Minus, Plus } from 'lucide-react';

interface EventClusterToggleProps {
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function EventClusterToggle({
  count,
  isOpen,
  onToggle,
}: EventClusterToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/5 px-4 py-1.5 text-sm font-medium text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-400/10"
    >
      {isOpen ? (
        <>
          <Minus className="h-4 w-4" /> Hide related events
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> {count} related event
          {count === 1 ? '' : 's'}
        </>
      )}
    </button>
  );
}
