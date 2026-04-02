'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { OutcomeCount } from '@/lib/types/analytics';
import { ChartTooltip } from './ChartTooltip';

interface BattleOutcomesChartProps {
  data: OutcomeCount[];
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

function getOutcomeColour(name: string, primaryColor: string): string {
  const outcomeColours: Record<string, string> = {
    victory: primaryColor,
    defeat: '#2C2C2C',
    pyrrhic: '#B8860B',
    draw: '#6B6B6B',
    unknown: '#4A4A4A',
  };

  return outcomeColours[name.toLowerCase()] ?? '#4A4A4A';
}

export function BattleOutcomesChart({
  data,
  primaryColor,
  width = 500,
  height = 300,
}: BattleOutcomesChartProps) {
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

  const total = useMemo(() => d3.sum(data, (item) => item.count), [data]);
  const victoryCount = useMemo(
    () =>
      data.find((item) => item.name.trim().toLowerCase() === 'victory')?.count ??
      0,
    [data]
  );
  const victoryPercentage =
    total > 0 ? Math.round((victoryCount / total) * 100) : 0;

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 100;
    const innerRadius = 55;

    const pie = d3
      .pie<OutcomeCount>()
      .sort(null)
      .value((item) => item.count)
      .padAngle(0.04);

    const arc = d3
      .arc<d3.PieArcDatum<OutcomeCount>>()
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
      .attr('fill', (item) => getOutcomeColour(item.data.name, primaryColor))
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
      .attr('y', -4)
      .attr('fill', '#D4AF37')
      .attr('font-size', 30)
      .attr('font-family', "'Cinzel', serif")
      .attr('font-weight', 700)
      .text(`${victoryPercentage}%`);

    chart
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 22)
      .attr('fill', '#D4AF37')
      .attr('font-size', 12)
      .attr('font-family', "'Cinzel', serif")
      .attr('letter-spacing', '0.18em')
      .text('VICTORIES');
  }, [data, height, hoveredIndex, primaryColor, total, victoryPercentage, width]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-sm text-[#9A8B70]">
        No battle outcome data available.
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full max-w-[320px]"
        />
      </div>
      <div className="flex flex-col justify-center gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-3">
            <span
              className="h-[14px] w-[14px] rounded-[3px]"
              style={{
                backgroundColor: getOutcomeColour(item.name, primaryColor),
              }}
            />
            <div className="flex min-w-0 items-baseline justify-between gap-4 flex-1">
              <span
                className="truncate"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '13px',
                  color: '#F5E6C8',
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#B8860B',
                }}
              >
                {item.count.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        <div className="text-sm leading-tight">
          <div style={{ fontFamily: "'Cinzel', serif" }}>{tooltip.name}</div>
          <div className="mt-1 text-base">
            {tooltip.count.toLocaleString()} battles
          </div>
          <div className="text-sm text-[#CBB58B]">
            {tooltip.percentage.toFixed(1)}% of {total.toLocaleString()}
          </div>
        </div>
      </ChartTooltip>
    </div>
  );
}
