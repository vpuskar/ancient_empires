'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineChapter } from '@/lib/types/timeline';
import { formatYearRange } from '@/lib/utils/year';

interface OdysseyHeroProps {
  empire: EmpireConfig;
  chapter: TimelineChapter | null;
}

export default function OdysseyHero({ empire, chapter }: OdysseyHeroProps) {
  const gradient = `linear-gradient(135deg, ${empire.color}, #0a0a0a)`;

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={chapter?.id ?? 'empty'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {chapter?.hero_image_url ? (
            <Image
              alt={chapter.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              src={chapter.hero_image_url}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="h-full w-full" style={{ background: gradient }} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

      {chapter ? (
        <div className="absolute left-6 top-6 flex h-44 w-64 flex-col items-center justify-center rounded-lg border-2 border-amber-400/40 bg-black/50 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-sm font-bold tracking-widest text-amber-400">
                {empire.name.toUpperCase()}
              </div>
              <div className="mt-1 text-xs text-zinc-300">
                {formatYearRange(chapter.period_start, chapter.period_end)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}
    </div>
  );
}
