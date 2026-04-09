import type { ReactNode } from 'react';
import { Cinzel, Cormorant_Garamond } from 'next/font/google';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '600'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400', '500'],
});

interface ChartCardProps {
  number: string;
  title: string;
  subtitle: string;
  accentColor: string;
  children: ReactNode;
}

export function ChartCard({
  number,
  title,
  subtitle,
  accentColor,
  children,
}: ChartCardProps) {
  return (
    <section
      className="rounded-xl p-7"
      style={{
        background: 'rgba(26,18,16,0.6)',
        border: '1px solid rgba(184,134,11,0.12)',
      }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p
            className={`${cinzel.className} text-sm tracking-[0.3em] uppercase`}
            style={{ color: accentColor }}
          >
            {number}
          </p>
          <h2
            className={`${cinzel.className} mt-3 text-2xl`}
            style={{ color: '#F5E6C8' }}
          >
            {title}
          </h2>
          <p
            className={`${cormorant.className} mt-2 text-lg`}
            style={{ color: '#9A8B70' }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
