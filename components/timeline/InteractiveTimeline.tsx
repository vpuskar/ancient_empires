'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';
import { track } from '@/lib/posthog/track';
import { EventCard } from './EventCard';

interface InteractiveTimelineProps {
  empire: EmpireConfig;
  events: TimelineEvent[];
  selectedCategory?: string;
  onEventClick?: (event: TimelineEvent) => void;
}

interface ActiveEvent {
  event: TimelineEvent;
  x: number;
  y: number;
}

interface TimelinePoint {
  event: TimelineEvent;
  x: number;
  y: number;
  index: number;
}

const SVG_HEIGHT = 300;
const AXIS_Y = 150;
const MIN_WIDTH = 760;
const PLAY_INTERVAL_MS = 3600;

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year > 0) return `${year} AD`;
  return '0';
}

function shouldLabelEvent(
  event: TimelineEvent,
  index: number,
  eventsLength: number
): boolean {
  if (index === 0 || index === eventsLength - 1) return true;
  if (event.significance >= 5) return true;

  const step = eventsLength > 90 ? 18 : eventsLength > 50 ? 10 : 5;
  return index % step === 0;
}

function getTimelineWidth(eventsLength: number): number {
  return Math.max(MIN_WIDTH, eventsLength * 72 + 180);
}

function getEventY(index: number): number {
  const offsets = [0, -24, 24, -12, 12];
  return AXIS_Y + offsets[index % offsets.length];
}

export function InteractiveTimeline({
  empire,
  events,
  selectedCategory = 'all',
  onEventClick,
}: InteractiveTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playIndexRef = useRef(0);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const timelineWidth = useMemo(
    () => getTimelineWidth(events.length),
    [events.length]
  );

  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const openEvent = useCallback(
    (event: TimelineEvent, x: number, y: number) => {
      setActiveEvent({ event, x, y: Math.max(26, y - 132) });
      onEventClick?.(event);
      track('timeline_event_clicked', {
        empire: empire.slug,
        event_name: event.name,
        event_year: event.year,
        category: event.category,
        selected_category: selectedCategory,
      });
    },
    [empire.slug, onEventClick, selectedCategory]
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || events.length === 0) return;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const minYear =
      d3.min(events, (event: TimelineEvent) => event.year) ?? empire.startYear;
    const maxYear =
      d3.max(events, (event: TimelineEvent) => event.year) ?? empire.endYear;
    const yearScale = d3
      .scaleLinear()
      .domain(
        minYear === maxYear ? [minYear - 1, maxYear + 1] : [minYear, maxYear]
      )
      .range([80, timelineWidth - 80]);

    const points: TimelinePoint[] = events.map((event, index) => ({
      event,
      x: yearScale(event.year),
      y: getEventY(index),
      index,
    }));

    const line = d3
      .line<TimelinePoint>()
      .x((point: TimelinePoint) => point.x)
      .y((point: TimelinePoint) => point.y)
      .curve(d3.curveBasis);

    svg
      .attr('viewBox', `0 0 ${timelineWidth} ${SVG_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMinYMid meet');

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', empire.color)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', `drop-shadow(0 0 8px ${empire.color}55)`);

    svg
      .append('g')
      .selectAll('line')
      .data(
        points.filter(({ event, index }: TimelinePoint) =>
          shouldLabelEvent(event, index, events.length)
        )
      )
      .join('line')
      .attr('x1', (point: TimelinePoint) => point.x)
      .attr('x2', (point: TimelinePoint) => point.x)
      .attr('y1', (point: TimelinePoint) => point.y + 13)
      .attr('y2', 226)
      .attr('stroke', 'rgba(80, 55, 32, 0.35)')
      .attr('stroke-width', 1);

    svg
      .append('g')
      .selectAll('text')
      .data(
        points.filter(({ event, index }: TimelinePoint) =>
          shouldLabelEvent(event, index, events.length)
        )
      )
      .join('text')
      .attr('x', (point: TimelinePoint) => point.x)
      .attr(
        'y',
        (_point: TimelinePoint, labelIndex: number) =>
          246 + (labelIndex % 2) * 20
      )
      .attr('text-anchor', 'middle')
      .attr('fill', '#5f4a2e')
      .attr('font-size', 12)
      .attr('font-weight', 700)
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(255, 248, 224, 0.8)')
      .style('stroke-width', 3)
      .text((point: TimelinePoint) => formatYear(point.event.year));

    const nodes = svg
      .append('g')
      .selectAll('circle')
      .data(points)
      .join('circle')
      .attr('cx', (point: TimelinePoint) => point.x)
      .attr('cy', (point: TimelinePoint) => point.y)
      .attr('r', 8)
      .attr('fill', empire.color)
      .attr('stroke', '#fff6d6')
      .attr('stroke-width', 2)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr(
        'aria-label',
        (point: TimelinePoint) =>
          `${point.event.name}, ${formatYear(point.event.year)}`
      )
      .style('cursor', 'pointer')
      .style('filter', `drop-shadow(0 0 5px ${empire.color}88)`);

    nodes
      .on('click', (_pointerEvent: PointerEvent, point: TimelinePoint) => {
        setIsPlaying(false);
        clearPlayInterval();
        openEvent(point.event, point.x, point.y);
      })
      .on('keydown', (keyboardEvent: KeyboardEvent, point: TimelinePoint) => {
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          setIsPlaying(false);
          clearPlayInterval();
          openEvent(point.event, point.x, point.y);
        }
      })
      .on('mouseenter', (mouseEvent: MouseEvent) => {
        d3.select(mouseEvent.currentTarget as SVGCircleElement).attr('r', 11);
      })
      .on('mouseleave', (mouseEvent: MouseEvent) => {
        d3.select(mouseEvent.currentTarget as SVGCircleElement).attr('r', 8);
      });
  }, [
    clearPlayInterval,
    empire.color,
    empire.endYear,
    empire.startYear,
    events,
    openEvent,
    timelineWidth,
  ]);

  useEffect(() => {
    clearPlayInterval();

    if (!isPlaying || events.length === 0) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = playIndexRef.current;
      const event = events[nextIndex];
      if (!event) {
        setIsPlaying(false);
        clearPlayInterval();
        return;
      }

      const minYear = events[0]?.year ?? empire.startYear;
      const maxYear = events[events.length - 1]?.year ?? empire.endYear;
      const yearScale = d3
        .scaleLinear()
        .domain(
          minYear === maxYear ? [minYear - 1, maxYear + 1] : [minYear, maxYear]
        )
        .range([80, timelineWidth - 80]);
      const x = yearScale(event.year);
      const y = getEventY(nextIndex);

      openEvent(event, x, y);
      scrollerRef.current?.scrollTo({
        left: Math.max(0, x - scrollerRef.current.clientWidth / 2),
        behavior: 'smooth',
      });

      if (nextIndex >= events.length - 1) {
        setIsPlaying(false);
        clearPlayInterval();
        return;
      }

      playIndexRef.current = nextIndex + 1;
    }, PLAY_INTERVAL_MS);

    return clearPlayInterval;
  }, [
    clearPlayInterval,
    empire.endYear,
    empire.startYear,
    events,
    isPlaying,
    openEvent,
    timelineWidth,
  ]);

  useEffect(() => {
    playIndexRef.current = 0;
    clearPlayInterval();
  }, [clearPlayInterval, events]);

  if (events.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-lg border border-[#8B7355]/60 bg-[#efe2bd] shadow-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(125, 92, 45, 0.18), transparent 24%), radial-gradient(circle at 75% 45%, rgba(79, 106, 85, 0.18), transparent 28%), linear-gradient(135deg, #ead8aa 0%, #d7bb7e 45%, #b88946 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'linear-gradient(30deg, transparent 46%, rgba(75, 53, 30, 0.18) 48%, transparent 50%), linear-gradient(120deg, transparent 48%, rgba(75, 53, 30, 0.14) 50%, transparent 52%)',
          backgroundSize: '120px 90px',
        }}
      />

      <button
        type="button"
        onClick={() => {
          if (!isPlaying && activeEvent) {
            const activeIndex = events.findIndex(
              (event) => event.id === activeEvent.event.id
            );
            playIndexRef.current = Math.min(
              Math.max(activeIndex + 1, 0),
              events.length - 1
            );
          }
          setIsPlaying((current) => !current);
        }}
        className="absolute left-4 top-4 z-30 rounded-md border border-black/15 bg-white/90 px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-white focus:outline-none focus:ring-2"
        style={{ ['--tw-ring-color' as string]: empire.color }}
      >
        {isPlaying ? 'Pause' : '▶ Play'}
      </button>

      <div
        ref={scrollerRef}
        className="relative h-[390px] overflow-x-auto overflow-y-hidden px-0 pt-14"
      >
        <div className="relative h-full" style={{ width: timelineWidth }}>
          <svg
            ref={svgRef}
            role="img"
            aria-label={`${empire.name} timeline from ${formatYear(
              events[0]?.year ?? empire.startYear
            )} to ${formatYear(events[events.length - 1]?.year ?? empire.endYear)}`}
            width={timelineWidth}
            height={SVG_HEIGHT}
            className="relative z-10 block"
          />

          {activeEvent && (
            <EventCard
              empire={empire}
              event={activeEvent.event}
              left={Math.min(Math.max(activeEvent.x, 168), timelineWidth - 168)}
              top={activeEvent.y}
              onClose={() => {
                setActiveEvent(null);
                setIsPlaying(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
