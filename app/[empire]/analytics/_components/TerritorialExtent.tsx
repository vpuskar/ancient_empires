'use client';

import { useEffect, useId, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { TerritorialPoint } from '@/lib/types/analytics';
import { ChartTooltip } from './ChartTooltip';

interface TerritorialExtentProps {
  data: TerritorialPoint[];
  primaryColor: string;
  width?: number;
  height?: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  year: number;
  areaKm2: number;
  label: string;
}

function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

export function TerritorialExtent({
  data,
  primaryColor,
  width = 560,
  height = 360,
}: TerritorialExtentProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gradientId = useId().replace(/:/g, '');
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    year: 0,
    areaKm2: 0,
    label: '',
  });

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 80, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', primaryColor)
      .attr('stop-opacity', 0.6);
    gradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', primaryColor)
      .attr('stop-opacity', 0.15);
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', primaryColor)
      .attr('stop-opacity', 0);

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scalePoint<number>()
      .domain(data.map((item) => item.year))
      .range([0, chartWidth])
      .padding(0.45);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (item) => item.areaKm2) ?? 0])
      .nice()
      .range([chartHeight, 0]);

    chart
      .append('g')
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-chartWidth)
          .tickFormat(() => '')
      )
      .call((group) => {
        group.select('.domain').remove();
        group
          .selectAll('.tick line')
          .attr('stroke', 'rgba(184,134,11,0.08)')
          .attr('stroke-dasharray', '4 4');
      });

    const xAxis = d3.axisBottom(x).tickFormat((value) => formatYear(Number(value)));
    const yAxis = d3
      .axisLeft(y)
      .ticks(5)
      .tickSize(0)
      .tickFormat((value) => `${Math.round(Number(value) / 1_000_000)}M`);

    chart
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .call((group) => {
        group.select('.domain').attr('stroke', 'rgba(184,134,11,0.15)');
        group.selectAll('.tick line').remove();
        group
          .selectAll('.tick text')
          .attr('fill', '#9A8B70')
          .attr('font-size', 11)
          .attr('font-family', "'Cinzel', serif");
      });

    chart
      .append('g')
      .call(yAxis)
      .call((group) => {
        group.select('.domain').remove();
        group.selectAll('.tick line').remove();
        group
          .selectAll('.tick text')
          .attr('fill', '#9A8B70')
          .attr('font-size', 12)
          .attr('font-family', "'Cormorant Garamond', serif");
      });

    chart
      .append('text')
      .attr('x', -34)
      .attr('y', -4)
      .attr('fill', '#9A8B70')
      .attr('font-size', 12)
      .attr('font-family', "'Cormorant Garamond', serif")
      .text('km²');

    const area = d3
      .area<TerritorialPoint>()
      .x((item) => x(item.year) ?? 0)
      .y0(chartHeight)
      .y1((item) => y(item.areaKm2))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<TerritorialPoint>()
      .x((item) => x(item.year) ?? 0)
      .y((item) => y(item.areaKm2))
      .curve(d3.curveMonotoneX);

    chart
      .append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    chart
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', primaryColor)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    chart
      .append('g')
      .selectAll('text.annotation')
      .data(data)
      .join('text')
      .attr('x', (item) => x(item.year) ?? 0)
      .attr('y', chartHeight + 44)
      .attr('text-anchor', 'middle')
      .attr('fill', '#9A8B70')
      .attr('font-size', 11)
      .attr('font-style', 'italic')
      .attr('font-family', "'Cormorant Garamond', serif")
      .text((item) => item.label);

    const dots = chart
      .append('g')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (item) => x(item.year) ?? 0)
      .attr('cy', (item) => y(item.areaKm2))
      .attr('r', 5)
      .attr('fill', '#B8860B')
      .attr('stroke', '#120C08')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    dots
      .on('mousemove', (event, item) => {
        const bounds = wrapperRef.current?.getBoundingClientRect();
        if (!bounds) return;

        d3.select(event.currentTarget).attr('r', 8);
        setTooltip({
          visible: true,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          year: item.year,
          areaKm2: item.areaKm2,
          label: item.label,
        });
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('r', 5);
        setTooltip((current) => ({ ...current, visible: false }));
      });
  }, [data, gradientId, height, primaryColor, width]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-sm text-[#9A8B70]">
        No territorial extent data available.
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
          <div style={{ fontFamily: "'Cinzel', serif" }}>
            {formatYear(tooltip.year)}
          </div>
          <div className="mt-1 text-base">
            {tooltip.areaKm2.toLocaleString()} km²
          </div>
          <div className="text-sm text-[#CBB58B]">{tooltip.label}</div>
        </div>
      </ChartTooltip>
    </div>
  );
}
