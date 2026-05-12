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

interface TimelinePoint {
  event: TimelineEvent;
  x: number;
  y: number;
  index: number;
}

interface ActiveEvent {
  event: TimelineEvent;
  xPercent: number;
  yPercent: number;
  index: number;
}

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 720;
const PLAY_INTERVAL_MS = 3400;

const CATEGORY_COLORS: Record<string, string> = {
  political: '#f2b84b',
  military: '#ef4444',
  cultural: '#60a5fa',
  religious: '#a78bfa',
  economic: '#34d399',
  natural: '#94a3b8',
};

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year > 0) return `${year} AD`;
  return '0';
}

function formatCategoryLabel(category: string): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#a8a29e';
}

function getDesignedY(index: number, eventsLength: number): number {
  const progress = eventsLength <= 1 ? 0 : index / (eventsLength - 1);
  const primaryWave = Math.sin(progress * Math.PI * 3.2) * 145;
  const secondaryWave = Math.sin(progress * Math.PI * 8.4 + 0.8) * 48;
  const alternatingBend = index % 5 === 0 ? 42 : index % 5 === 2 ? -36 : 0;

  return Math.min(
    VIEWBOX_HEIGHT - 118,
    Math.max(118, 360 + primaryWave + secondaryWave + alternatingBend)
  );
}

function shouldFeaturePoint(
  point: TimelinePoint,
  pointsLength: number
): boolean {
  if (point.index === 0 || point.index === pointsLength - 1) return true;
  if (point.event.significance >= 5) return true;

  const step = pointsLength > 120 ? 24 : pointsLength > 80 ? 16 : 10;
  return point.index % step === 0;
}

function shouldShowThumbnail(
  point: TimelinePoint,
  featuredPoints: TimelinePoint[]
): boolean {
  const featuredIndex = featuredPoints.findIndex(
    (featuredPoint) => featuredPoint.event.id === point.event.id
  );

  return featuredIndex >= 0 && featuredIndex < 8;
}

function getPoints(
  events: TimelineEvent[],
  empire: EmpireConfig
): TimelinePoint[] {
  const minYear = d3.min(events, (event: TimelineEvent) => event.year);
  const maxYear = d3.max(events, (event: TimelineEvent) => event.year);
  const yearScale = d3
    .scaleLinear()
    .domain(
      minYear === undefined || maxYear === undefined
        ? [empire.startYear, empire.endYear]
        : minYear === maxYear
          ? [minYear - 1, maxYear + 1]
          : [minYear, maxYear]
    )
    .range([92, VIEWBOX_WIDTH - 92]);

  return events.map((event, index) => ({
    event,
    x: yearScale(event.year),
    y: getDesignedY(index, events.length),
    index,
  }));
}

export function InteractiveTimeline({
  empire,
  events,
  selectedCategory = 'all',
  onEventClick,
}: InteractiveTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playIndexRef = useRef(0);
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const points = useMemo(() => getPoints(events, empire), [empire, events]);

  const featuredPoints = useMemo(
    () => points.filter((point) => shouldFeaturePoint(point, points.length)),
    [points]
  );

  const thumbnailPoints = useMemo(
    () => points.filter((point) => shouldShowThumbnail(point, featuredPoints)),
    [featuredPoints, points]
  );

  const progressPercent =
    events.length <= 1 || !activeEvent
      ? activeEvent
        ? 100
        : 0
      : (activeEvent.index / (events.length - 1)) * 100;

  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const openPoint = useCallback(
    (point: TimelinePoint) => {
      setActiveEvent({
        event: point.event,
        xPercent: (point.x / VIEWBOX_WIDTH) * 100,
        yPercent: (point.y / VIEWBOX_HEIGHT) * 100,
        index: point.index,
      });
      onEventClick?.(point.event);
      track('timeline_event_clicked', {
        empire: empire.slug,
        event_name: point.event.name,
        event_year: point.event.year,
        category: point.event.category,
        selected_category: selectedCategory,
      });
    },
    [empire.slug, onEventClick, selectedCategory]
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || points.length === 0) return;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid slice');

    const defs = svg.append('defs');

    const glow = defs.append('filter').attr('id', 'timeline-glow');
    glow
      .append('feGaussianBlur')
      .attr('stdDeviation', 7)
      .attr('result', 'coloredBlur');
    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'coloredBlur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const softBlur = defs.append('filter').attr('id', 'soft-map-blur');
    softBlur.append('feGaussianBlur').attr('stdDeviation', 1.2);

    const line = d3
      .line<TimelinePoint>()
      .x((point: TimelinePoint) => point.x)
      .y((point: TimelinePoint) => point.y)
      .curve(d3.curveCatmullRom.alpha(0.65));

    const territoryLines = d3.range(12).map((lineIndex) =>
      d3.range(9).map((pointIndex) => ({
        x: -80 + pointIndex * 175,
        y:
          82 +
          lineIndex * 54 +
          Math.sin(pointIndex * 1.3 + lineIndex * 0.7) * 18,
      }))
    );

    const backgroundGroup = svg.append('g').attr('aria-hidden', 'true');
    territoryLines.forEach((territoryLine, lineIndex) => {
      backgroundGroup
        .append('path')
        .datum(territoryLine)
        .attr(
          'd',
          d3
            .line<{ x: number; y: number }>()
            .x((point) => point.x)
            .y((point) => point.y)
            .curve(d3.curveBasis)
        )
        .attr('fill', 'none')
        .attr(
          'stroke',
          lineIndex % 3 === 0
            ? 'rgba(232, 211, 151, 0.13)'
            : 'rgba(148, 163, 184, 0.1)'
        )
        .attr('stroke-width', lineIndex % 4 === 0 ? 1.6 : 0.9)
        .attr('stroke-dasharray', lineIndex % 2 === 0 ? '10 16' : '4 14')
        .style('filter', 'url(#soft-map-blur)');
    });

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', empire.color)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 22)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', 'url(#timeline-glow)');

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#f5c967')
      .attr('stroke-opacity', 0.88)
      .attr('stroke-width', 8)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', 'drop-shadow(0 0 16px rgba(245, 201, 103, 0.72))');

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#fff3b0')
      .attr('stroke-opacity', 0.95)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    svg
      .append('g')
      .selectAll('text')
      .data(featuredPoints)
      .join('text')
      .attr('x', (point: TimelinePoint) => point.x)
      .attr('y', (point: TimelinePoint) =>
        point.y > VIEWBOX_HEIGHT * 0.58 ? point.y - 28 : point.y + 38
      )
      .attr('text-anchor', 'middle')
      .attr('fill', '#f8efd2')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(7, 10, 12, 0.86)')
      .style('stroke-width', 5)
      .text((point: TimelinePoint) => formatYear(point.event.year));

    const nodeGroups = svg
      .append('g')
      .selectAll('g')
      .data(points)
      .join('g')
      .attr(
        'transform',
        (point: TimelinePoint) => `translate(${point.x},${point.y})`
      )
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr(
        'aria-label',
        (point: TimelinePoint) =>
          `${point.event.name}, ${formatYear(point.event.year)}`
      )
      .style('cursor', 'pointer');

    nodeGroups
      .append('circle')
      .attr(
        'r',
        (point: TimelinePoint) => 17 + Math.min(point.event.significance, 5)
      )
      .attr('fill', (point: TimelinePoint) =>
        getCategoryColor(point.event.category)
      )
      .attr('opacity', 0.2)
      .style('filter', 'url(#timeline-glow)');

    nodeGroups
      .append('circle')
      .attr('r', 12)
      .attr('fill', '#070a0c')
      .attr('stroke', '#ffe6a1')
      .attr('stroke-width', 2.5);

    nodeGroups
      .append('circle')
      .attr('r', 7)
      .attr('fill', (point: TimelinePoint) =>
        getCategoryColor(point.event.category)
      )
      .attr('stroke', 'rgba(255,255,255,0.85)')
      .attr('stroke-width', 1.3)
      .style(
        'filter',
        (point: TimelinePoint) =>
          `drop-shadow(0 0 9px ${getCategoryColor(point.event.category)})`
      );

    nodeGroups
      .on('click', (pointerEvent: PointerEvent, point: TimelinePoint) => {
        pointerEvent.stopPropagation();
        setIsPlaying(false);
        clearPlayInterval();
        openPoint(point);
      })
      .on('keydown', (keyboardEvent: KeyboardEvent, point: TimelinePoint) => {
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          setIsPlaying(false);
          clearPlayInterval();
          openPoint(point);
        }
      })
      .on('mouseenter', (mouseEvent: MouseEvent) => {
        d3.select(mouseEvent.currentTarget as SVGGElement)
          .select('circle:nth-child(2)')
          .attr('r', 15);
      })
      .on('mouseleave', (mouseEvent: MouseEvent) => {
        d3.select(mouseEvent.currentTarget as SVGGElement)
          .select('circle:nth-child(2)')
          .attr('r', 12);
      });
  }, [clearPlayInterval, empire, featuredPoints, openPoint, points]);

  useEffect(() => {
    clearPlayInterval();

    if (!isPlaying || points.length === 0) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = playIndexRef.current;
      const point = points[nextIndex];

      if (!point) {
        setIsPlaying(false);
        clearPlayInterval();
        return;
      }

      openPoint(point);

      if (nextIndex >= points.length - 1) {
        setIsPlaying(false);
        clearPlayInterval();
        return;
      }

      playIndexRef.current = nextIndex + 1;
    }, PLAY_INTERVAL_MS);

    return clearPlayInterval;
  }, [clearPlayInterval, isPlaying, openPoint, points]);

  useEffect(() => {
    playIndexRef.current = 0;
    clearPlayInterval();
  }, [clearPlayInterval, events]);

  useEffect(() => {
    return clearPlayInterval;
  }, [clearPlayInterval]);

  if (events.length === 0) return null;

  return (
    <div
      className="relative min-h-[560px] overflow-hidden rounded-2xl border border-white/10 bg-[#050706] shadow-2xl md:min-h-[76vh]"
      onClick={() => {
        setActiveEvent(null);
        setIsPlaying(false);
        clearPlayInterval();
      }}
      style={{
        background:
          'radial-gradient(circle at 18% 24%, rgba(74, 92, 65, 0.42), transparent 20%), radial-gradient(circle at 78% 34%, rgba(19, 58, 80, 0.5), transparent 25%), radial-gradient(circle at 55% 76%, rgba(105, 70, 34, 0.38), transparent 29%), linear-gradient(135deg, #11150f 0%, #17211c 35%, #0b1821 63%, #2a1e13 100%)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            'linear-gradient(22deg, transparent 48%, rgba(228, 205, 147, 0.14) 49%, transparent 51%), linear-gradient(116deg, transparent 47%, rgba(79, 128, 116, 0.14) 49%, transparent 52%), radial-gradient(circle at center, transparent 0 42%, rgba(255,255,255,0.06) 43%, transparent 44%)',
          backgroundSize: '170px 130px, 210px 160px, 52px 52px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 28%, rgba(0,0,0,0.42) 70%, rgba(0,0,0,0.88) 100%)',
        }}
      />

      <button
        type="button"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          if (!isPlaying && activeEvent) {
            playIndexRef.current = Math.min(
              activeEvent.index + 1,
              events.length - 1
            );
          }
          setIsPlaying((current) => !current);
        }}
        className="absolute left-4 top-4 z-30 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-sm font-semibold text-[#fff2c4] shadow-xl backdrop-blur-md transition hover:bg-black/70 focus:outline-none focus:ring-2 md:left-6 md:top-6"
        style={{ ['--tw-ring-color' as string]: empire.color }}
      >
        {isPlaying ? 'Pause' : '▶ Play'}
      </button>

      <div className="pointer-events-none absolute left-4 top-20 z-20 max-w-[14rem] text-xs uppercase tracking-[0.22em] text-[#f5e6bd]/70 md:left-6 md:top-24">
        {empire.nativeName}
      </div>

      <svg
        ref={svgRef}
        role="img"
        aria-label={`${empire.name} cinematic timeline from ${formatYear(
          events[0]?.year ?? empire.startYear
        )} to ${formatYear(events[events.length - 1]?.year ?? empire.endYear)}`}
        className="absolute inset-0 z-10 h-full w-full"
      />

      {thumbnailPoints.map((point, thumbnailIndex) => {
        const imageUrl = point.event.ruler?.image_url ?? null;
        const left = `${Math.min(87, Math.max(9, (point.x / VIEWBOX_WIDTH) * 100))}%`;
        const topOffset = point.y > VIEWBOX_HEIGHT * 0.55 ? -16 : 11;
        const top = `${Math.min(
          80,
          Math.max(13, (point.y / VIEWBOX_HEIGHT) * 100 + topOffset)
        )}%`;

        return (
          <button
            key={point.event.id}
            type="button"
            onClick={(clickEvent) => {
              clickEvent.stopPropagation();
              setIsPlaying(false);
              clearPlayInterval();
              openPoint(point);
            }}
            className="absolute z-20 hidden w-32 -translate-x-1/2 overflow-hidden rounded-xl border border-white/15 bg-black/55 text-left shadow-2xl backdrop-blur-md transition hover:-translate-y-1 hover:border-[#f5c967]/60 focus:outline-none focus:ring-2 md:block"
            style={{
              left,
              top,
              ['--tw-ring-color' as string]: empire.color,
            }}
          >
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={`${point.event.name} illustration`}
                className="h-16 w-full object-cover opacity-85"
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-16 w-full"
                style={{
                  background: `linear-gradient(135deg, ${empire.color}66, rgba(245, 201, 103, 0.18)), radial-gradient(circle at ${
                    24 + thumbnailIndex * 8
                  }% 35%, rgba(255,255,255,0.28), transparent 21%)`,
                }}
              />
            )}
            <div className="p-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#f5c967]">
                {formatYear(point.event.year)}
              </div>
              <div className="line-clamp-2 text-xs font-semibold leading-snug text-[#fff8df]">
                {point.event.name}
              </div>
            </div>
          </button>
        );
      })}

      {activeEvent && (
        <EventCard
          empire={empire}
          event={activeEvent.event}
          leftPercent={activeEvent.xPercent}
          topPercent={activeEvent.yPercent}
          onClose={() => {
            setActiveEvent(null);
            setIsPlaying(false);
            clearPlayInterval();
          }}
        />
      )}

      <div className="absolute right-5 top-1/2 z-20 hidden h-[58%] w-12 -translate-y-1/2 items-center justify-center md:flex">
        <div className="relative h-full w-px bg-white/18">
          <div
            className="absolute left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full bg-[#f5c967] shadow-[0_0_18px_rgba(245,201,103,0.8)] transition-all"
            style={{ height: `${progressPercent}%` }}
          />
          {d3.range(7).map((tick) => (
            <span
              key={tick}
              className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-[#f5c967]/70 bg-black shadow-[0_0_12px_rgba(245,201,103,0.45)]"
              style={{ top: `${tick * (100 / 6)}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-wrap items-center gap-2 border-t border-white/10 bg-black/45 px-4 py-3 text-xs text-[#f5e6bd]/80 backdrop-blur-md md:px-6">
        {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
          <span key={category} className="inline-flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shadow-[0_0_10px_currentColor]"
              style={{ backgroundColor: color, color }}
              aria-hidden="true"
            />
            {formatCategoryLabel(category)}
          </span>
        ))}
      </div>
    </div>
  );
}
