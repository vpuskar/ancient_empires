import type { Metadata, Viewport } from 'next';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { fontBody, fontDisplay } from '@/lib/fonts';
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo/metadata';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontDisplay.variable} ${fontBody.variable} font-body antialiased`}
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
