'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

import {
  BUTTERFLY_BANDS,
  SCRUBBER_MAX,
  SCRUBBER_MIN,
} from '@/lib/config/compare/scrubber';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';
import type { EmpireConfig } from '@/lib/empires/config';
import type { EmpireExtentRow } from '@/lib/types/compare';

interface VisualPulseProps {
  extents: EmpireExtentRow[];
  currentYear: number;
}

const width = 800;
const height = 220;
const margin = {
  top: 24,
  right: 24,
  bottom: 28,
  left: 24,
};

type ButterflyBand = (typeof BUTTERFLY_BANDS)[number];

function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BC`;
  }

  if (year === 0) {
    return '1 BC';
  }

  return `${year} AD`;
}

export default function VisualPulse({
  extents,
  currentYear,
}: VisualPulseProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const markerRef = useRef<SVGLineElement | null>(null);
  const xScaleRef = useRef<d3.ScaleLinear<number, number> | null>(null);

  useEffect(() => {
    const svgElement = svgRef.current;

    if (!svgElement) {
      return;
    }

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();
    markerRef.current = null;

    const innerHeight = height - margin.top - margin.bottom;
    const xScale = d3
      .scaleLinear()
      .domain([SCRUBBER_MIN, SCRUBBER_MAX])
      .range([margin.left, width - margin.right]);
    const maxArea =
      d3.max(extents, (extent: EmpireExtentRow) => extent.area_km2) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxArea])
      .nice()
      .range([height - margin.bottom, margin.top]);

    xScaleRef.current = xScale;

    const groupedExtents = d3.group(
      extents,
      (extent: EmpireExtentRow) => extent.empire_id
    );

    const area = d3
      .area<EmpireExtentRow>()
      .defined((extent: EmpireExtentRow) => extent.area_km2 != null)
      .x((extent: EmpireExtentRow) => xScale(extent.year))
      .y0(height)
      .y1((extent: EmpireExtentRow) => yScale(extent.area_km2))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<EmpireExtentRow>()
      .defined((extent: EmpireExtentRow) => extent.area_km2 != null)
      .x((extent: EmpireExtentRow) => xScale(extent.year))
      .y((extent: EmpireExtentRow) => yScale(extent.area_km2))
      .curve(d3.curveMonotoneX);

    const chartLayer = svg.append('g');

    const bands = chartLayer
      .selectAll('rect.compare-band')
      .data(BUTTERFLY_BANDS)
      .join('rect')
      .attr('class', 'compare-band')
      .attr('x', (band: ButterflyBand) => xScale(band.start))
      .attr('y', margin.top)
      .attr(
        'width',
        (band: ButterflyBand) => xScale(band.end) - xScale(band.start)
      )
      .attr('height', innerHeight)
      .attr('fill', (band: ButterflyBand) => band.color);

    bands.append('title').text((band: ButterflyBand) => band.label);

    for (const empire of EMPIRE_CONFIGS) {
      const points = [...(groupedExtents.get(empire.id) ?? [])].sort(
        (left, right) => left.year - right.year
      );

      if (points.length === 0) {
        continue;
      }

      chartLayer
        .append('path')
        .datum(points)
        .attr('fill', empire.color)
        .attr('fill-opacity', 0.2)
        .attr('d', area);

      chartLayer
        .append('path')
        .datum(points)
        .attr('fill', 'none')
        .attr('stroke', empire.color)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-opacity', 1)
        .attr('stroke-width', 2)
        .attr('d', line);
    }

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues(d3.range(SCRUBBER_MIN, SCRUBBER_MAX + 1, 400))
          .tickFormat((value: number | { valueOf(): number }) =>
            formatYear(Number(value))
          )
      )
      .call((axis: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        axis.select('.domain').attr('stroke', '#d6d3d1')
      )
      .call((axis: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        axis.selectAll('.tick line').attr('stroke', '#d6d3d1')
      )
      .call((axis: d3.Selection<SVGGElement, unknown, null, undefined>) =>
        axis
          .selectAll('.tick text')
          .attr('fill', '#78716c')
          .attr('font-size', 10)
      );

    const marker = svg
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#57534e')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1)
      .style('transition', 'transform 150ms ease');

    markerRef.current = marker.node();

    const legend = svg
      .append('g')
      .attr(
        'transform',
        `translate(${width - margin.right - 140},${margin.top})`
      );

    const legendRows = legend
      .selectAll('g')
      .data(EMPIRE_CONFIGS)
      .join('g')
      .attr(
        'transform',
        (_empire: EmpireConfig, index: number) => `translate(0,${index * 18})`
      );

    legendRows
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('rx', 2)
      .attr('fill', (empire: EmpireConfig) => empire.color);

    legendRows
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .attr('fill', '#44403c')
      .attr('font-size', 11)
      .text((empire: EmpireConfig) => empire.name);

    return () => {
      svg.selectAll('*').remove();
      markerRef.current = null;
      xScaleRef.current = null;
    };
  }, [extents]);

  useEffect(() => {
    const marker = markerRef.current;
    const xScale = xScaleRef.current;

    if (!marker || !xScale) {
      return;
    }

    marker.style.transform = `translateX(${xScale(currentYear)}px)`;
  }, [currentYear]);

  return (
    <div className="overflow-hidden rounded border border-stone-200 bg-white">
      <svg
        ref={svgRef}
        aria-label="Territorial extent comparison across empires"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 800 220"
      />
    </div>
  );
}
