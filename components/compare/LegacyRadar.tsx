'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

import {
  LEGACY_RADAR_DATA,
  type LegacyDimensions,
} from '@/lib/config/compare/legacyRadar';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';
import type { EmpireConfig } from '@/lib/empires/config';

const dimensions: Array<{
  key: keyof LegacyDimensions;
  label: string;
}> = [
  { key: 'governance', label: 'Governance' },
  { key: 'architecture', label: 'Architecture' },
  { key: 'science', label: 'Science' },
  { key: 'language', label: 'Language' },
  { key: 'philosophy', label: 'Philosophy' },
];

const centerX = 160;
const centerY = 120;
const radius = 82;

type RadarPoint = {
  x: number;
  y: number;
  value: number;
  label: string;
};

function getPoint(index: number, value: number): RadarPoint {
  const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
  const scaledRadius = (value / 100) * radius;

  return {
    x: centerX + Math.cos(angle) * scaledRadius,
    y: centerY + Math.sin(angle) * scaledRadius,
    value,
    label: dimensions[index]?.label ?? '',
  };
}

export default function LegacyRadar() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgElement = svgRef.current;

    if (!svgElement) {
      return;
    }

    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const line = d3
      .line<RadarPoint>()
      .x((point: RadarPoint) => point.x)
      .y((point: RadarPoint) => point.y)
      .curve(d3.curveLinearClosed);

    const chart = svg.append('g');

    for (const ringValue of [25, 50, 75, 100]) {
      const points = dimensions.map((_dimension, index) =>
        getPoint(index, ringValue)
      );

      chart
        .append('path')
        .datum(points)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#d6d3d1')
        .attr('stroke-width', 1);
    }

    dimensions.forEach((dimension, index) => {
      const tip = getPoint(index, 100);
      const label = getPoint(index, 118);

      chart
        .append('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', tip.x)
        .attr('y2', tip.y)
        .attr('stroke', '#e7e5e4')
        .attr('stroke-width', 1);

      chart
        .append('text')
        .attr('x', label.x)
        .attr('y', label.y)
        .attr('fill', '#57534e')
        .attr('font-size', 11)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(dimension.label);
    });

    for (const empire of EMPIRE_CONFIGS) {
      const profile = LEGACY_RADAR_DATA[empire.id];

      if (!profile) {
        continue;
      }

      const points = dimensions.map((dimension, index) =>
        getPoint(index, profile.dimensions[dimension.key])
      );

      chart
        .append('path')
        .datum(points)
        .attr('d', line)
        .attr('fill', empire.color)
        .attr('fill-opacity', 0.15)
        .attr('stroke', empire.color)
        .attr('stroke-width', 2);

      chart
        .selectAll(`circle.legacy-dot-${empire.id}`)
        .data(points)
        .join('circle')
        .attr('class', `legacy-dot-${empire.id}`)
        .attr('cx', (point: RadarPoint) => point.x)
        .attr('cy', (point: RadarPoint) => point.y)
        .attr('r', 3)
        .attr('fill', empire.color);
    }

    const legend = svg.append('g').attr('transform', 'translate(72,224)');

    const rows = legend
      .selectAll('g')
      .data(EMPIRE_CONFIGS)
      .join('g')
      .attr(
        'transform',
        (_empire: EmpireConfig, index: number) =>
          `translate(${(index % 2) * 98},${Math.floor(index / 2) * 18})`
      );

    rows
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('rx', 2)
      .attr('fill', (empire: EmpireConfig) => empire.color);

    rows
      .append('text')
      .attr('x', 16)
      .attr('y', 9)
      .attr('fill', '#44403c')
      .attr('font-size', 11)
      .text((empire: EmpireConfig) => empire.name);

    return () => {
      svg.selectAll('*').remove();
    };
  }, []);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4">
      <svg
        ref={svgRef}
        aria-label="Curated cultural legacy radar comparison"
        className="h-auto w-full"
        role="img"
        viewBox="0 0 320 300"
        width="100%"
      />
      <p className="mt-2 text-center text-xs text-stone-500">
        Curated legacy profile scores, 0–100. Not objective historical data.
      </p>
    </section>
  );
}
