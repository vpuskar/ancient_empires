'use client';

import type { ReactNode } from 'react';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

interface ChartTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  children: ReactNode;
}

export function ChartTooltip({
  visible,
  x,
  y,
  children,
}: ChartTooltipProps) {
  return (
    <div
      className={cormorant.className}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, calc(-100% - 12px))',
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 120ms ease',
        background: 'rgba(18,12,8,0.95)',
        border: '1px solid rgba(184,134,11,0.4)',
        borderRadius: '6px',
        padding: '10px 14px',
        color: '#F5E6C8',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        zIndex: 20,
      }}
    >
      {children}
    </div>
  );
}
