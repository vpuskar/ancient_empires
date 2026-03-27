'use client';

/**
 * EmptyState
 *
 * Displayed when a filtered list produces zero results.
 * Used in rulers list and map markers.
 *
 * Usage:
 *   <EmptyState message="No rulers match your filters" />
 */

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({
  message = 'No results found',
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {/* Decorative circle */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 bg-white/[0.02]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="opacity-20"
        >
          <circle
            cx="10"
            cy="10"
            r="7"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M10 7v3M10 13h.01"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-sm text-parchment/30">{message}</p>
    </div>
  );
}
