'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FeatureCollection, Geometry } from 'geojson';
import type { EmpireConfig } from '@/lib/empires/config';
import type { TimelineEvent } from '@/lib/services/events';
import { track } from '@/lib/posthog/track';
import { EventCard } from './EventCard';
import {
  formatCategoryLabel,
  getInitial,
  normalizeTimelineEvents,
  type NormalizedTimelineEvent,
} from './timelineDisplay';

interface InteractiveTimelineProps {
  empire: EmpireConfig;
  events: TimelineEvent[];
  selectedCategory?: string;
  onEventClick?: (event: TimelineEvent) => void;
}

interface TimelinePoint {
  event: NormalizedTimelineEvent;
  x: number;
  y: number;
  index: number;
}

interface ActiveEvent {
  event: NormalizedTimelineEvent;
  xPercent: number;
  yPercent: number;
  index: number;
}

type GeoJsonData = FeatureCollection<Geometry>;
type GeoCoordinate = [number, number];

const VIEWBOX_WIDTH = 1440;
const VIEWBOX_HEIGHT = 820;
const PLAY_INTERVAL_MS = 3400;

const CATEGORY_COLORS: Record<string, string> = {
  political: '#f2b84b',
  military: '#ef4444',
  cultural: '#60a5fa',
  religious: '#a78bfa',
  economic: '#34d399',
  natural: '#94a3b8',
};

const GEOJSON_BACKGROUNDS: Record<string, string> = {
  roman: '/geojson/roman_200.geojson',
  chinese: '/geojson/chinese_1800.geojson',
  japanese: '/geojson/japanese_1938.geojson',
  ottoman: '/geojson/ottoman_1600.geojson',
};

const ROUTE_PRESETS: Record<string, GeoCoordinate[]> = {
  roman: [
    [-5.35, 36.13],
    [2.17, 41.38],
    [12.48, 41.89],
    [23.73, 37.98],
    [29.0, 41.0],
    [31.24, 30.04],
    [35.5, 33.9],
    [44.4, 33.3],
  ],
  chinese: [
    [103.8, 36.1],
    [108.9, 34.3],
    [112.9, 28.2],
    [116.4, 39.9],
    [118.8, 32.1],
    [121.5, 31.2],
    [126.6, 45.8],
    [87.6, 43.8],
  ],
  japanese: [
    [130.4, 33.6],
    [135.5, 34.7],
    [139.7, 35.7],
    [141.3, 43.1],
    [127.7, 26.2],
    [121.5, 25.0],
    [126.98, 37.56],
    [123.4, 41.8],
    [145.7, 15.2],
  ],
  ottoman: [
    [26.0, 40.2],
    [28.98, 41.0],
    [32.85, 39.93],
    [35.2, 32.1],
    [31.24, 30.04],
    [44.36, 33.31],
    [21.43, 41.99],
    [18.41, 43.86],
  ],
};

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  if (year > 0) return `${year} AD`;
  return '0';
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#a8a29e';
}

function interpolateRoute(
  route: GeoCoordinate[],
  progress: number
): GeoCoordinate {
  if (route.length === 0) return [0, 0];
  if (route.length === 1) return route[0] ?? [0, 0];

  const scaled = progress * (route.length - 1);
  const startIndex = Math.min(Math.floor(scaled), route.length - 2);
  const segmentProgress = scaled - startIndex;
  const start = route[startIndex] ?? route[0] ?? [0, 0];
  const end = route[startIndex + 1] ?? start;

  return [
    start[0] + (end[0] - start[0]) * segmentProgress,
    start[1] + (end[1] - start[1]) * segmentProgress,
  ];
}

function getProjection(geoJson: GeoJsonData | null) {
  const projection = d3.geoMercator();

  if (geoJson) {
    projection.fitExtent(
      [
        [68, 72],
        [VIEWBOX_WIDTH - 68, VIEWBOX_HEIGHT - 72],
      ],
      geoJson
    );
    return projection;
  }

  projection
    .center([0, 35])
    .scale(520)
    .translate([VIEWBOX_WIDTH / 2, VIEWBOX_HEIGHT / 2]);
  return projection;
}

function getPoints(
  events: NormalizedTimelineEvent[],
  empire: EmpireConfig,
  geoJson: GeoJsonData | null
): TimelinePoint[] {
  const projection = getProjection(geoJson);
  const route = ROUTE_PRESETS[empire.slug] ?? ROUTE_PRESETS.roman;

  return events.map((event, index) => {
    const progress = events.length <= 1 ? 0 : index / (events.length - 1);
    const coordinate = interpolateRoute(route, progress);
    const projected = projection(coordinate);
    const wave = Math.sin(progress * Math.PI * 7.2) * 18;

    return {
      event,
      x: projected?.[0] ?? VIEWBOX_WIDTH / 2,
      y: (projected?.[1] ?? VIEWBOX_HEIGHT / 2) + wave,
      index,
    };
  });
}

function shouldFeaturePoint(
  point: TimelinePoint,
  pointsLength: number
): boolean {
  if (point.index === 0 || point.index === pointsLength - 1) return true;
  if (point.event.significance >= 5) return true;

  const step = pointsLength > 120 ? 24 : pointsLength > 80 ? 17 : 9;
  return point.index % step === 0;
}

function shouldShowThumbnail(
  point: TimelinePoint,
  featuredPoints: TimelinePoint[]
): boolean {
  const featuredIndex = featuredPoints.findIndex(
    (featuredPoint) => featuredPoint.event.id === point.event.id
  );

  return featuredIndex >= 0 && featuredIndex < 7;
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
  const [geoJson, setGeoJson] = useState<GeoJsonData | null>(null);

  const normalizedEvents = useMemo(
    () => normalizeTimelineEvents(events),
    [events]
  );

  const points = useMemo(
    () => getPoints(normalizedEvents, empire, geoJson),
    [empire, normalizedEvents, geoJson]
  );

  const featuredPoints = useMemo(
    () => points.filter((point) => shouldFeaturePoint(point, points.length)),
    [points]
  );

  const thumbnailPoints = useMemo(
    () => points.filter((point) => shouldShowThumbnail(point, featuredPoints)),
    [featuredPoints, points]
  );

  const progressPercent =
    normalizedEvents.length <= 1 || !activeEvent
      ? activeEvent
        ? 100
        : 0
      : (activeEvent.index / (normalizedEvents.length - 1)) * 100;

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
      onEventClick?.(point.event.source);
      track('timeline_event_clicked', {
        empire: empire.slug,
        event_name: point.event.title,
        event_year: point.event.year,
        category: point.event.category,
        selected_category: selectedCategory,
      });
    },
    [empire.slug, onEventClick, selectedCategory]
  );

  useEffect(() => {
    const geoJsonUrl = GEOJSON_BACKGROUNDS[empire.slug];
    let isCancelled = false;

    if (!geoJsonUrl) return;

    fetch(geoJsonUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${geoJsonUrl}`);
        }
        return response.json() as Promise<GeoJsonData>;
      })
      .then((data) => {
        if (!isCancelled) {
          setGeoJson(data);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setGeoJson(null);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [empire.slug]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement || points.length === 0) return;

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    svg
      .attr('viewBox', `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid slice');

    const defs = svg.append('defs');

    const waterGradient = defs
      .append('radialGradient')
      .attr('id', 'timeline-water')
      .attr('cx', '48%')
      .attr('cy', '44%')
      .attr('r', '78%');
    waterGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#183a3c');
    waterGradient
      .append('stop')
      .attr('offset', '54%')
      .attr('stop-color', '#10242b');
    waterGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#071014');

    const landGradient = defs
      .append('linearGradient')
      .attr('id', 'timeline-land')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    landGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#5a4f2e');
    landGradient
      .append('stop')
      .attr('offset', '45%')
      .attr('stop-color', '#253a2b');
    landGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#7a5531');

    const routeGlow = defs.append('filter').attr('id', 'route-glow');
    routeGlow
      .append('feGaussianBlur')
      .attr('stdDeviation', 9)
      .attr('result', 'coloredBlur');
    const routeMerge = routeGlow.append('feMerge');
    routeMerge.append('feMergeNode').attr('in', 'coloredBlur');
    routeMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const projection = getProjection(geoJson);
    const path = d3.geoPath(projection);

    svg
      .append('rect')
      .attr('width', VIEWBOX_WIDTH)
      .attr('height', VIEWBOX_HEIGHT)
      .attr('fill', 'url(#timeline-water)');

    const graticule = d3.geoGraticule().step([5, 5]);
    svg
      .append('path')
      .datum(graticule())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(214, 196, 145, 0.12)')
      .attr('stroke-width', 0.8)
      .attr('stroke-dasharray', '3 12');

    if (geoJson) {
      svg
        .append('g')
        .attr('aria-hidden', 'true')
        .selectAll('path')
        .data(geoJson.features)
        .join('path')
        .attr('d', path)
        .attr('fill', 'url(#timeline-land)')
        .attr('fill-opacity', 0.86)
        .attr('stroke', 'rgba(255, 230, 161, 0.42)')
        .attr('stroke-width', 1.25)
        .style('filter', 'drop-shadow(0 0 14px rgba(224, 197, 125, 0.24))');

      svg
        .append('g')
        .attr('aria-hidden', 'true')
        .selectAll('path')
        .data(geoJson.features)
        .join('path')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', empire.color)
        .attr('stroke-opacity', 0.38)
        .attr('stroke-width', 4)
        .style('filter', `drop-shadow(0 0 12px ${empire.color}66)`);
    }

    svg
      .append('g')
      .attr('aria-hidden', 'true')
      .selectAll('circle')
      .data(points.filter((point) => point.index % 11 === 0))
      .join('circle')
      .attr('cx', (point: TimelinePoint) => point.x)
      .attr('cy', (point: TimelinePoint) => point.y)
      .attr('r', (_point: TimelinePoint, index: number) => 90 + index * 8)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.045)')
      .attr('stroke-width', 1.2);

    const line = d3
      .line<TimelinePoint>()
      .x((point: TimelinePoint) => point.x)
      .y((point: TimelinePoint) => point.y)
      .curve(d3.curveCatmullRom.alpha(0.72));

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', empire.color)
      .attr('stroke-opacity', 0.45)
      .attr('stroke-width', 30)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', 'url(#route-glow)');

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#f0b94f')
      .attr('stroke-opacity', 0.94)
      .attr('stroke-width', 10)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', 'drop-shadow(0 0 18px rgba(240, 185, 79, 0.82))');

    svg
      .append('path')
      .datum(points)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#fff2ad')
      .attr('stroke-opacity', 0.95)
      .attr('stroke-width', 3.5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    svg
      .append('g')
      .selectAll('text')
      .data(featuredPoints)
      .join('text')
      .attr('x', (point: TimelinePoint) => point.x)
      .attr('y', (point: TimelinePoint) =>
        point.y > VIEWBOX_HEIGHT * 0.55 ? point.y - 34 : point.y + 42
      )
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff4c8')
      .attr('font-size', 18)
      .attr('font-weight', 800)
      .style('paint-order', 'stroke')
      .style('stroke', 'rgba(2, 6, 8, 0.92)')
      .style('stroke-width', 6)
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
          `${point.event.title}, ${formatYear(point.event.year)}`
      )
      .style('cursor', 'pointer');

    nodeGroups
      .append('circle')
      .attr(
        'r',
        (point: TimelinePoint) => 16 + Math.min(point.event.significance, 5)
      )
      .attr('fill', (point: TimelinePoint) =>
        getCategoryColor(point.event.category)
      )
      .attr('opacity', 0.24)
      .style('filter', 'url(#route-glow)');

    nodeGroups
      .append('circle')
      .attr('r', 12)
      .attr('fill', 'rgba(2, 6, 8, 0.94)')
      .attr('stroke', '#ffe6a1')
      .attr('stroke-width', 2.6);

    nodeGroups
      .append('circle')
      .attr('r', 7)
      .attr('fill', (point: TimelinePoint) =>
        getCategoryColor(point.event.category)
      )
      .attr('stroke', 'rgba(255,255,255,0.88)')
      .attr('stroke-width', 1.35)
      .style(
        'filter',
        (point: TimelinePoint) =>
          `drop-shadow(0 0 11px ${getCategoryColor(point.event.category)})`
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
  }, [clearPlayInterval, empire, featuredPoints, geoJson, openPoint, points]);

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

  if (normalizedEvents.length === 0) return null;

  return (
    <div
      className="relative min-h-[640px] overflow-hidden bg-[#061014] shadow-[0_30px_120px_rgba(0,0,0,0.62)] md:min-h-[82vh]"
      onClick={() => {
        setActiveEvent(null);
        setIsPlaying(false);
        clearPlayInterval();
      }}
    >
      <svg
        ref={svgRef}
        role="img"
        aria-label={`${empire.name} map-backed cinematic timeline from ${formatYear(
          normalizedEvents[0]?.year ?? empire.startYear
        )} to ${formatYear(
          normalizedEvents[normalizedEvents.length - 1]?.year ?? empire.endYear
        )}`}
        className="absolute inset-0 z-10 h-full w-full"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 33%, rgba(0,0,0,0.34) 66%, rgba(0,0,0,0.9) 100%), linear-gradient(180deg, rgba(0,0,0,0.36), transparent 28%, transparent 72%, rgba(0,0,0,0.48))',
        }}
      />

      <button
        type="button"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          if (!isPlaying && activeEvent) {
            playIndexRef.current = Math.min(
              activeEvent.index + 1,
              normalizedEvents.length - 1
            );
          }
          setIsPlaying((current) => !current);
        }}
        className="absolute left-4 top-4 z-40 rounded-full border border-[#f5c967]/35 bg-black/55 px-4 py-2 text-sm font-semibold text-[#fff2c4] shadow-xl backdrop-blur-md transition hover:bg-black/72 focus:outline-none focus:ring-2 md:left-6 md:top-6"
        style={{ ['--tw-ring-color' as string]: empire.color }}
      >
        {isPlaying ? 'Pause' : '▶ Play'}
      </button>

      <div className="pointer-events-none absolute left-4 top-20 z-30 max-w-[15rem] text-xs uppercase tracking-[0.22em] text-[#f5e6bd]/72 md:left-6 md:top-24">
        {empire.nativeName}
      </div>

      {thumbnailPoints.map((point, thumbnailIndex) => {
        const imageUrl = point.event.imageUrl ?? point.event.rulerImageUrl;
        const left = `${Math.min(87, Math.max(11, (point.x / VIEWBOX_WIDTH) * 100))}%`;
        const topOffset = point.y > VIEWBOX_HEIGHT * 0.55 ? -14 : 10;
        const top = `${Math.min(
          78,
          Math.max(16, (point.y / VIEWBOX_HEIGHT) * 100 + topOffset)
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
            className="absolute z-30 hidden w-36 -translate-x-1/2 overflow-hidden rounded-sm border border-[#f5dfad]/30 bg-[#160f09]/78 p-1 text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#f5c967]/70 focus:outline-none focus:ring-2 md:block"
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
                alt={`${point.event.title} illustration`}
                className="h-20 w-full object-cover sepia-[0.45] saturate-75"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-20 w-full items-center justify-center border border-[#e8c987]/22 text-xl font-bold text-[#f6ddb0]"
                style={{
                  background: `radial-gradient(circle at ${
                    24 + thumbnailIndex * 9
                  }% 30%, rgba(255,239,194,0.22), transparent 18%), linear-gradient(135deg, rgba(76,45,18,0.92), rgba(30,21,14,0.95)), repeating-linear-gradient(35deg, transparent 0 13px, rgba(255,255,255,0.045) 13px 14px), linear-gradient(135deg, ${empire.color}55, transparent)`,
                  boxShadow: `inset 0 0 24px ${getCategoryColor(
                    point.event.category
                  )}33`,
                }}
              >
                {getInitial(point.event.title)}
              </div>
            )}
            <div className="px-2 py-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-[#f5c967]">
                {formatYear(point.event.year)}
              </div>
              <div className="line-clamp-2 text-xs font-semibold leading-snug text-[#fff8df]">
                {point.event.title}
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

      <div className="absolute right-5 top-1/2 z-30 hidden h-[60%] w-12 -translate-y-1/2 items-center justify-center md:flex">
        <div className="relative h-full w-px bg-[#f5c967]/20">
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

      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-3 text-xs text-[#f5e6bd]/84 shadow-2xl backdrop-blur-md md:left-auto md:right-8 md:justify-start">
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
