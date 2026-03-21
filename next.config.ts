import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {};

export default withSentryConfig(nextConfig, {
  // Suppresses source map upload logs during build
  silent: true,
  // Upload source maps only in CI (SENTRY_AUTH_TOKEN required)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
