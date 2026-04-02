'use client';

import { useEffect, useId, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { DynastyCount } from '@/lib/types/analytics';
import { ChartTooltip } from './ChartTooltip';

interface DynastyChartProps {
  data: DynastyCount[];
  primaryColor: string;
  width?: number;
  height?: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  name: string;
  count: number;
}

function getBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  const safeRadius = Math.min(radius, height / 2, width / 2);
  const right = x + width;
  const bottom = y + height;

  return [
    `M${x},${y}`,
    `H${right - safeRadius}`,
    `Q${right},${y} ${right},${y + safeRadius}`,
    `V${bottom - safeRadius}`,
    `Q${right},${bottom} ${right - safeRadius},${bottom}`,
    `H${x}`,
    'Z',
  ].join(' ');
}

export function DynastyChart({
  data,
  primaryColor,
  width = 500,
  height = 380,
}: DynastyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gradientId = useId().replace(/:/g, '');
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    count: 0,
  });

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = {
      top: 28,
      right: 28,
      bottom: 42,
      left: 150,
    };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = Math.max(
      height - margin.top - margin.bottom,
      sortedData.length * 30
    );

    svg.attr('viewBox', `0 0 ${width} ${margin.top + chartHeight + margin.bottom}`);

    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', primaryColor);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#B8860B');

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    chart
      .append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', -12)
      .attr('y2', -12)
      .attr('stroke', primaryColor)
      .attr('stroke-opacity', 0.3)
      .attr('stroke-width', 1);

    const y = d3
      .scaleBand<string>()
      .domain(sortedData.map((item) => item.name))
      .range([0, chartHeight])
      .paddingInner(0.2)
      .paddingOuter(0.1);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (item) => item.count) ?? 0])
      .nice()
      .range([0, chartWidth]);

    const xAxis = d3
      .axisBottom(x)
      .ticks(5)
      .tickSizeOuter(0)
      .tickFormat((value) => d3.format('d')(Number(value)));

    const yAxis = d3.axisLeft(y).tickSize(0);

    chart
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .call((group) => {
        group.select('.domain').attr('stroke', 'rgba(184,134,11,0.15)');
        group
          .selectAll('.tick line')
          .attr('stroke', 'rgba(184,134,11,0.15)');
        group
          .selectAll('.tick text')
          .attr('fill', '#9A8B70')
          .attr('font-size', 12)
          .attr('font-family', "'Cormorant Garamond', serif");
      });

    chart
      .append('g')
      .call(yAxis)
      .call((group) => {
        group.select('.domain').remove();
        group.selectAll('.tick line').remove();
        group
          .selectAll('.tick text')
          .attr('fill', '#F5E6C8')
          .attr('font-size', 11)
          .attr('font-family', "'Cinzel', serif");
      });

    const bars = chart
      .append('g')
      .selectAll('path')
      .data(sortedData)
      .join('path')
      .attr('d', (item) =>
        getBarPath(0, y(item.name) ?? 0, x(item.count), 24, 6)
      )
      .attr('fill', `url(#${gradientId})`)
      .attr('opacity', 0.86)
      .style('cursor', 'pointer');

    bars
      .on('mousemove', (event, item) => {
        const bounds = wrapperRef.current?.getBoundingClientRect();
        if (!bounds) return;

        d3.select(event.currentTarget).attr('opacity', 1);
        setTooltip({
          visible: true,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          name: item.name,
          count: item.count,
        });
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('opacity', 0.86);
        setTooltip((current) => ({ ...current, visible: false }));
      });
  }, [data, gradientId, height, primaryColor, width]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-sm text-[#9A8B70]">
        No dynasty data available.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
      />
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        <div className="text-sm leading-tight">
          <div style={{ fontFamily: "'Cinzel', serif" }}>{tooltip.name}</div>
          <div className="mt-1 text-base">{tooltip.count.toLocaleString()} rulers</div>
        </div>
      </ChartTooltip>
    </div>
  );
}
