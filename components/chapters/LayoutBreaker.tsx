'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

export function TimelineDivider({ year }: { year: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex items-center gap-4 py-8"
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      <span className="rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5 text-xs font-medium tracking-widest text-[#C9A84C]">
        {formatYear(year)}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
    </motion.div>
  );
}

export function QuoteBlock({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.blockquote
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="my-8 border-l-4 border-[#8B0000] bg-[#1A1510] px-6 py-5"
    >
      <p className="font-display text-lg leading-relaxed text-[#F0ECE2]/90 italic">
        {children}
      </p>
    </motion.blockquote>
  );
}

export function ImagePlaceholder({ caption }: { caption: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.figure
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="my-8 flex flex-col items-center"
    >
      <div className="flex h-48 w-full max-w-lg items-center justify-center rounded-lg border border-dashed border-[#8B7355]/40 bg-[#1a1815]">
        <span className="text-sm text-[#8B7355]">Image coming soon</span>
      </div>
      <figcaption className="mt-3 text-center text-xs tracking-wide text-[#8B7355]">
        {caption}
      </figcaption>
    </motion.figure>
  );
}
