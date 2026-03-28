import { PostHog } from 'posthog-node';

let posthogInstance: PostHog | null = null;

export function getPostHog(): PostHog | null {
  const key = process.env.POSTHOG_API_KEY;
  if (!key) return null;

  if (!posthogInstance) {
    posthogInstance = new PostHog(key, {
      host: process.env.POSTHOG_HOST || 'https://app.posthog.com',
    });
  }

  return posthogInstance;
}
