'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TerritorialTimelineData } from '@/lib/types/territorial';
import { ContextPanel } from './ContextPanel';
import { RadialVisualization } from './RadialVisualization';
import { StoryStrip } from './StoryStrip';
import { TimelineScrubber } from './TimelineScrubber';
import { TimelineHeader } from './TimelineHeader';

interface TerritorialTimelineProps {
  empire: EmpireConfig;
  data: TerritorialTimelineData;
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;
  const parsed = Number.parseInt(value, 16);

  return `rgba(${(parsed >> 16) & 255}, ${(parsed >> 8) & 255}, ${parsed & 255}, ${alpha})`;
}

export function TerritorialTimeline({
  empire,
  data,
}: TerritorialTimelineProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeSnapshot = data.snapshots[activeIdx];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIdx((current) => {
        if (current >= data.snapshots.length - 1) {
          window.clearInterval(interval);
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [data.snapshots.length, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isFormField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isFormField) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        setIsPlaying(false);
        setActiveIdx((current) => Math.max(0, current - 1));
      }

      if (event.key === 'ArrowRight') {
        setIsPlaying(false);
        setActiveIdx((current) => Math.min(data.snapshots.length - 1, current + 1));
      }

      if (event.key === ' ') {
        event.preventDefault();
        setIsPlaying((current) => {
          if (!current && activeIdx >= data.snapshots.length - 1) {
            setActiveIdx(0);
            return true;
          }

          return !current;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, data.snapshots.length]);

  const handleSelect = (index: number) => {
    setIsPlaying(false);
    setActiveIdx(index);
  };

  const handlePlayToggle = () => {
    if (activeIdx >= data.snapshots.length - 1) {
      setActiveIdx(0);
    }

    setIsPlaying((current) => !current);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#120C08_0%,#1A1210_52%,#0D0A07_100%)] text-[#F5E6C8]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <TimelineHeader
          empireName={empire.name}
          empireNativeName={empire.nativeName}
          empireColor={empire.color}
          activeSnapshot={activeSnapshot}
        />
      </motion.div>

      <div className="mx-auto flex min-h-[calc(100vh-157px)] w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-12">
        <section className="flex flex-1 flex-col gap-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <motion.div
              className="flex min-w-0 flex-1 flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            >
              <div className="space-y-3">
                <p className="font-body text-sm uppercase tracking-[0.35em] text-[#9A8B70]">
                  {activeSnapshot.era}
                </p>
                <p className="font-body text-sm italic text-[#B8A88A]">
                  {activeSnapshot.eraDesc}
                </p>
              </div>
              <div className="w-full">
                <RadialVisualization
                  areaKm2={activeSnapshot.areaKm2}
                  maxAreaKm2={data.maxAreaKm2}
                  label={activeSnapshot.label}
                  empireColor={empire.color}
                  capital={empire.capital}
                  animate
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            >
              <ContextPanel
                snapshot={activeSnapshot}
                maxAreaKm2={data.maxAreaKm2}
                empireColor={empire.color}
              />
            </motion.div>
          </div>

          <motion.div
            className="flex w-full max-w-[660px] flex-col items-center gap-4 self-center sm:flex-row sm:items-center sm:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          >
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 hover:brightness-110"
              style={{
                backgroundColor: hexToRgba(empire.color, 0.15),
                borderColor: hexToRgba(empire.color, 0.3),
              }}
              onClick={handlePlayToggle}
              aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
            >
              <span className="text-sm text-[#F5E6C8]">
                {isPlaying ? '||' : '>'}
              </span>
            </button>

            <StoryStrip snapshot={activeSnapshot} empireColor={empire.color} />
          </motion.div>
        </section>

        <motion.section
          className="mt-8 rounded-[28px] border-t border-[rgba(184,134,11,0.08)] bg-[rgba(10,8,5,0.5)] px-5 py-4 sm:px-9 sm:pb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
        >
          <TimelineScrubber
            snapshots={data.snapshots}
            markers={data.markers}
            activeIdx={activeIdx}
            onSelect={handleSelect}
            onPlayToggle={handlePlayToggle}
            isPlaying={isPlaying}
            empireColor={empire.color}
          />
        </motion.section>
      </div>

      <footer className="border-t border-[rgba(184,134,11,0.1)] px-6 py-6 text-center">
        <p className="font-display text-[12px] uppercase tracking-[0.33em] text-[#6B5B47]">
          Ancient Empires / {empire.name} Territorial Timeline
        </p>
      </footer>
    </main>
  );
}
