'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { CenturyActivity } from '@/lib/types/analytics';
import { ChartTooltip } from './ChartTooltip';

interface ActivityByCenturyProps {
  data: CenturyActivity[];
  primaryColor: string;
  width?: number;
  height?: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  century: string;
  events: number;
  battles: number;
}

export function ActivityByCentury({
  data,
  primaryColor,
  width = 560,
  height = 350,
}: ActivityByCenturyProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    century: '',
    events: 0,
    battles: 0,
  });

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const defs = svg.append('defs');
    const eventsGradient = defs
      .append('linearGradient')
      .attr('id', 'events-area-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    eventsGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#B8860B')
      .attr('stop-opacity', 0.5);
    eventsGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#B8860B')
      .attr('stop-opacity', 0);

    const battlesGradient = defs
      .append('linearGradient')
      .attr('id', 'battles-area-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');

    battlesGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', primaryColor)
      .attr('stop-opacity', 0.5);
    battlesGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', primaryColor)
      .attr('stop-opacity', 0);

    const x = d3
      .scalePoint<string>()
      .domain(data.map((item) => item.century))
      .range([0, chartWidth])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (item) => Math.max(item.events, item.battles)) ?? 0])
      .nice()
      .range([chartHeight, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).ticks(5).tickSize(0);

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

    chart
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .call((group) => {
        group.select('.domain').remove();
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

    const battlesArea = d3
      .area<CenturyActivity>()
      .x((item) => x(item.century) ?? 0)
      .y0(chartHeight)
      .y1((item) => y(item.battles))
      .curve(d3.curveMonotoneX);

    const eventsArea = d3
      .area<CenturyActivity>()
      .x((item) => x(item.century) ?? 0)
      .y0(chartHeight)
      .y1((item) => y(item.events))
      .curve(d3.curveMonotoneX);

    const battlesLine = d3
      .line<CenturyActivity>()
      .x((item) => x(item.century) ?? 0)
      .y((item) => y(item.battles))
      .curve(d3.curveMonotoneX);

    const eventsLine = d3
      .line<CenturyActivity>()
      .x((item) => x(item.century) ?? 0)
      .y((item) => y(item.events))
      .curve(d3.curveMonotoneX);

    chart
      .append('path')
      .datum(data)
      .attr('fill', 'url(#battles-area-gradient)')
      .attr('d', battlesArea);

    chart
      .append('path')
      .datum(data)
      .attr('fill', 'url(#events-area-gradient)')
      .attr('d', eventsArea);

    chart
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', primaryColor)
      .attr('stroke-width', 2)
      .attr('d', battlesLine);

    chart
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#B8860B')
      .attr('stroke-width', 2)
      .attr('d', eventsLine);

    const crosshair = chart
      .append('line')
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', 'rgba(184,134,11,0.35)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4 4')
      .style('opacity', 0);

    chart
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (item) => (x(item.century) ?? 0) - chartWidth / data.length / 2)
      .attr('y', 0)
      .attr('width', chartWidth / data.length)
      .attr('height', chartHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mousemove', (event, item) => {
        const bounds = wrapperRef.current?.getBoundingClientRect();
        if (!bounds) return;

        crosshair
          .attr('x1', x(item.century) ?? 0)
          .attr('x2', x(item.century) ?? 0)
          .style('opacity', 1);

        setTooltip({
          visible: true,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          century: item.century,
          events: item.events,
          battles: item.battles,
        });
      })
      .on('mouseleave', () => {
        crosshair.style('opacity', 0);
        setTooltip((current) => ({ ...current, visible: false }));
      });
  }, [data, height, primaryColor, width]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-sm text-[#9A8B70]">
        No century activity data available.
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
      <div className="mt-4 flex flex-wrap gap-6">
        <div
          className="flex items-center gap-2 text-sm text-[#F5E6C8]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span className="text-[#B8860B]">●──</span>
          <span>Events</span>
        </div>
        <div
          className="flex items-center gap-2 text-sm text-[#F5E6C8]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span style={{ color: primaryColor }}>●──</span>
          <span>Battles</span>
        </div>
      </div>
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        <div className="text-sm leading-tight">
          <div style={{ fontFamily: "'Cinzel', serif" }}>{tooltip.century}</div>
          <div className="mt-1 text-base">
            {tooltip.events.toLocaleString()} events
          </div>
          <div className="text-base">{tooltip.battles.toLocaleString()} battles</div>
        </div>
      </ChartTooltip>
    </div>
  );
}
