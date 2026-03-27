'use client';

/**
 * GoldDivider
 *
 * Decorative divider line used across landing, rulers, story, and timeline.
 * Renders a gradient line from empire-color (or gold) to transparent.
 *
 * @param width   - CSS width (default: '50px')
 * @param align   - 'left' | 'center' | 'right' (default: 'left')
 * @param className - Additional Tailwind classes
 */

interface GoldDividerProps {
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function GoldDivider({
  width = '50px',
  align = 'left',
  className = '',
}: GoldDividerProps) {
  return (
    <div
      className={`h-px ${
        align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
      } ${className}`}
      style={{
        width,
        background:
          align === 'center'
            ? 'linear-gradient(90deg, transparent, var(--empire-color, #C9A84C), transparent)'
            : 'linear-gradient(90deg, var(--empire-color, #C9A84C), transparent)',
        opacity: 0.35,
      }}
    />
  );
}
