import { posthog } from './client';

/**
 * Safe wrapper around posthog.capture — never throws.
 * Call from client components only.
 */
export function track(
  event: string,
  properties?: Record<string, unknown>
): void {
  try {
    posthog.capture(event, properties);
  } catch {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[analytics] Failed to track:', event);
    }
  }
}
