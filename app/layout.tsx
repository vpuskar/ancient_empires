import type { Metadata } from 'next';
import { fontDisplay, fontBody } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ancient Empires - Interactive History Platform',
  description:
    "Explore four of history's greatest civilisations through interactive maps, animated timelines, and immersive storytelling.",
  openGraph: {
    title: 'Ancient Empires',
    description:
      'Interactive maps, timelines, and stories of the Roman, Chinese, Japanese, and Ottoman Empires.',
    images: ['/og-fallback.png'],
  },
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
        {children}
      </body>
    </html>
  );
}
