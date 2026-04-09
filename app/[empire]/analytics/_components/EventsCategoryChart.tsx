'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { CategoryCount } from '@/lib/types/analytics';
import { ChartTooltip } from './ChartTooltip';

interface EventsCategoryChartProps {
  data: CategoryCount[];
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
  percentage: number;
}

function getCategoryColour(name: string, primaryColor: string): string {
  const categoryColours: Record<string, string> = {
    military: primaryColor,
    political: '#B8860B',
    cultural: '#4A6741',
    religious: '#6B4C8A',
    economic: '#8B6914',
    natural: '#5B7B8A',
    uncategorised: '#6B6B6B',
  };

  return categoryColours[name.toLowerCase()] ?? '#6B6B6B';
}

export function EventsCategoryChart({
  data,
  primaryColor,
  width = 500,
  height = 380,
}: EventsCategoryChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    name: '',
    count: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const total = d3.sum(data, (item) => item.count);
    const centerX = width / 2;
    const centerY = 138;
    const outerRadius = 120;
    const innerRadius = 70;

    const pie = d3
      .pie<CategoryCount>()
      .sort(null)
      .value((item) => item.count)
      .padAngle(0.03);

    const arc = d3
      .arc<d3.PieArcDatum<CategoryCount>>()
      .innerRadius(innerRadius)
      .outerRadius((_, index) =>
        index === hoveredIndex ? outerRadius + 5 : outerRadius
      );

    const chart = svg
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    chart
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('d', arc)
      .attr('fill', (item) => getCategoryColour(item.data.name, primaryColor))
      .style('cursor', 'pointer')
      .on('mousemove', (event, item) => {
        const bounds = wrapperRef.current?.getBoundingClientRect();
        if (!bounds || total === 0) return;

        setHoveredIndex(data.indexOf(item.data));
        setTooltip({
          visible: true,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          name: item.data.name,
          count: item.data.count,
          percentage: (item.data.count / total) * 100,
        });
      })
      .on('mouseleave', () => {
        setHoveredIndex(null);
        setTooltip((current) => ({ ...current, visible: false }));
      });

    chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -2)
      .attr('fill', '#F5E6C8')
      .attr('font-size', 30)
      .attr('font-weight', 700)
      .attr('font-family', "'Cinzel', serif")
      .text(total.toLocaleString());

    chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 24)
      .attr('fill', '#9A8B70')
      .attr('font-size', 11)
      .attr('letter-spacing', '0.24em')
      .attr('font-family', "'Cinzel', serif")
      .text('EVENTS');
  }, [data, height, hoveredIndex, primaryColor, width]);

  const total = d3.sum(data, (item) => item.count);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-sm text-[#9A8B70]">
        No event category data available.
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
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-[14px] w-[14px] rounded-[2px]"
              style={{
                backgroundColor: getCategoryColour(item.name, primaryColor),
              }}
            />
            <span
              className="text-sm text-[#F5E6C8]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {item.name} ({item.count.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        <div className="text-sm leading-tight">
          <div style={{ fontFamily: "'Cinzel', serif" }}>{tooltip.name}</div>
          <div className="mt-1 text-base">
            {tooltip.count.toLocaleString()} events
          </div>
          <div className="text-sm text-[#CBB58B]">
            {tooltip.percentage.toFixed(1)}% of {total.toLocaleString()}
          </div>
        </div>
      </ChartTooltip>
    </div>
  );
}
