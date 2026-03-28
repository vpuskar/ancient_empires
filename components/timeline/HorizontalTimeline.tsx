'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';
import { EventDetailCard } from './EventDetailCard';

const CATEGORY_COLORS: Record<string, string> = {
  political: '#C9A84C',
  military: '#8B0000',
  cultural: '#9370DB',
};

function getMarkerRadius(significance: number): number {
  if (significance >= 5) return 12;
  if (significance >= 3) return 9;
  return 6;
}

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  return `${year} AD`;
}

interface Props {
  events: TimelineEvent[];
  empire: EmpireConfig;
}

export function HorizontalTimeline({ events, empire }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    null
  );
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const playIndexRef = useRef(0);

  const SPACING = 200;
  const PADDING = 100;
  const SVG_HEIGHT = 300;
  const AXIS_Y = SVG_HEIGHT / 2;
  const totalWidth = events.length * SPACING + PADDING * 2;

  // Autoplay
  useEffect(() => {
    if (!isPlaying || events.length === 0) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      playIndexRef.current = (playIndexRef.current + 1) % events.length;
      const targetX =
        PADDING + playIndexRef.current * SPACING - container.clientWidth / 2;
      container.scrollTo({ left: targetX, behavior: 'smooth' });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, events.length]);

  // Drag-to-scroll
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      scrollLeft: scrollRef.current.scrollLeft,
    };
    setIsPlaying(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className="relative">
      {/* Autoplay toggle */}
      <button
        onClick={() => setIsPlaying((p) => !p)}
        className="absolute right-0 top-0 z-10 rounded-lg border border-[#8B7355] bg-[#1a1815] px-3 py-1.5 text-xs text-[#F0ECE2] transition hover:border-[#C9A84C]"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="h-[400px] cursor-grab overflow-x-auto overflow-y-hidden rounded-lg border border-[#8B7355] bg-[#1a1815] active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <svg
          width={totalWidth}
          height={SVG_HEIGHT}
          className="mt-[50px]"
          style={{ minWidth: totalWidth }}
        >
          {/* Axis line */}
          <line
            x1={PADDING}
            y1={AXIS_Y}
            x2={totalWidth - PADDING}
            y2={AXIS_Y}
            stroke="#8B7355"
            strokeWidth={2}
          />

          {/* Era ticks at start and end */}
          <text
            x={PADDING}
            y={AXIS_Y + 50}
            textAnchor="middle"
            fill="#8B7355"
            fontSize={11}
          >
            {formatYear(events[0]?.year ?? empire.start)}
          </text>
          <text
            x={totalWidth - PADDING}
            y={AXIS_Y + 50}
            textAnchor="middle"
            fill="#8B7355"
            fontSize={11}
          >
            {formatYear(events[events.length - 1]?.year ?? empire.end)}
          </text>

          {/* Event markers */}
          {events.map((event, i) => {
            const cx = PADDING + i * SPACING;
            const cy = AXIS_Y;
            const r = getMarkerRadius(event.significance);
            const color = CATEGORY_COLORS[event.category] ?? '#C9A84C';
            const isHovered = hoveredId === event.id;

            return (
              <g
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="cursor-pointer"
              >
                {/* Tick line */}
                <line
                  x1={cx}
                  y1={AXIS_Y - 15}
                  x2={cx}
                  y2={AXIS_Y + 15}
                  stroke="#8B7355"
                  strokeWidth={1}
                  opacity={0.4}
                />

                {/* Marker circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? r * 1.2 : r}
                  fill={color}
                  stroke="#F0ECE2"
                  strokeWidth={2}
                  style={{
                    transition: 'r 0.2s ease',
                    filter: isHovered
                      ? `drop-shadow(0 0 6px ${color})`
                      : 'none',
                  }}
                />

                {/* Year label */}
                <text
                  x={cx}
                  y={AXIS_Y + 40}
                  textAnchor="end"
                  fill="#8B7355"
                  fontSize={10}
                  transform={`rotate(-45, ${cx}, ${AXIS_Y + 40})`}
                >
                  {formatYear(event.year)}
                </text>

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={cx - 100}
                      y={cy - r - 45}
                      width={200}
                      height={30}
                      rx={6}
                      fill="#0C0B09"
                      fillOpacity={0.95}
                      stroke={color}
                      strokeWidth={1}
                    />
                    <text
                      x={cx}
                      y={cy - r - 25}
                      textAnchor="middle"
                      fill="#F0ECE2"
                      fontSize={11}
                      fontWeight="bold"
                    >
                      {event.name.length > 30
                        ? event.name.slice(0, 28) + '…'
                        : event.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Category legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#8B7355]">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize">{cat}</span>
          </div>
        ))}
        <div className="ml-4 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-[#8B7355]" />
            Low
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-[#8B7355]" />
            Med
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-4 w-4 rounded-full bg-[#8B7355]" />
            High
          </span>
        </div>
      </div>

      {/* Detail card */}
      {selectedEvent && (
        <EventDetailCard
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
