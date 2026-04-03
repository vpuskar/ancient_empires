'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { PlaceTypeCount } from '@/lib/types/analytics';
import { ChartTooltip } from './ChartTooltip';

interface PlacesTreemapProps {
  data: PlaceTypeCount[];
  primaryColor: string;
  width?: number;
  height?: number;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  count: number;
  percentage: number;
}

type TreemapNodeDatum = {
  name: string;
  value: number;
  type: string;
};

type TreemapRootDatum = {
  children: TreemapNodeDatum[];
};

export function PlacesTreemap({
  data,
  primaryColor,
  width = 560,
  height = 340,
}: PlacesTreemapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    count: 0,
    percentage: 0,
  });

  const total = useMemo(() => d3.sum(data, (item) => item.count), [data]);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const treemapPalette = [
      primaryColor,
      '#A0522D',
      '#B8860B',
      '#6B4C8A',
      '#5B7B8A',
      '#4A6741',
      '#8B6914',
      '#6B6B6B',
    ];

    const rootData: TreemapRootDatum = {
      children: data.map((item) => ({
        name: item.label,
        value: item.count,
        type: item.type,
      })),
    };

    const root = d3
      .hierarchy<TreemapRootDatum | TreemapNodeDatum>(
        rootData,
        (item) => ('children' in item ? item.children : undefined)
      )
      .sum((item) => ('value' in item ? item.value : 0))
      .sort((left, right) => (right.value ?? 0) - (left.value ?? 0));

    const treemapRoot = d3
      .treemap<TreemapRootDatum | TreemapNodeDatum>()
      .tile(d3.treemapSquarify)
      .size([width, height - 40])
      .paddingInner(3)(root);

    const leaves = treemapRoot.leaves() as d3.HierarchyRectangularNode<TreemapNodeDatum>[];

    const nodes = svg
      .append('g')
      .selectAll('g')
      .data(leaves)
      .join('g')
      .attr('transform', (item) => `translate(${item.x0},${item.y0})`);

    nodes
      .append('rect')
      .attr('width', (item) => Math.max(0, item.x1 - item.x0))
      .attr('height', (item) => Math.max(0, item.y1 - item.y0))
      .attr('rx', 4)
      .attr('fill', (_, index) => treemapPalette[index % treemapPalette.length])
      .attr('fill-opacity', 0.82)
      .attr('stroke', 'rgba(18,12,8,0.8)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mousemove', (event, item) => {
        const bounds = wrapperRef.current?.getBoundingClientRect();
        if (!bounds || total === 0) return;

        d3.select(event.currentTarget).attr('fill-opacity', 0.98);
        setTooltip({
          visible: true,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          label: item.data.name,
          count: item.data.value,
          percentage: (item.data.value / total) * 100,
        });
      })
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('fill-opacity', 0.82);
        setTooltip((current) => ({ ...current, visible: false }));
      });

    nodes.each(function addLabels(item) {
      const group = d3.select(this);
      const nodeWidth = item.x1 - item.x0;
      const nodeHeight = item.y1 - item.y0;

      if (nodeWidth <= 60 || nodeHeight <= 40) {
        return;
      }

      const labelSize = nodeWidth > 120 && nodeHeight > 80 ? 13 : 11;
      const valueSize = nodeWidth > 120 && nodeHeight > 80 ? 15 : 13;
      const centerX = nodeWidth / 2;
      const centerY = nodeHeight / 2;

      group
        .append('text')
        .attr('x', centerX)
        .attr('y', centerY - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', '#F5E6C8')
        .attr('font-size', labelSize)
        .attr('font-family', "'Cinzel', serif")
        .text(item.data.name);

      group
        .append('text')
        .attr('x', centerX)
        .attr('y', centerY + 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#B8860B')
        .attr('font-size', valueSize)
        .attr('font-family', "'Cormorant Garamond', serif")
        .text(item.data.value.toLocaleString());
    });
  }, [data, height, primaryColor, total, width]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-sm text-[#9A8B70]">
        No places data available.
      </div>
    );
  }

  const treemapPalette = [
    primaryColor,
    '#A0522D',
    '#B8860B',
    '#6B4C8A',
    '#5B7B8A',
    '#4A6741',
    '#8B6914',
    '#6B6B6B',
  ];

  return (
    <div ref={wrapperRef} className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
      />
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
        {data.map((item, index) => (
          <div key={item.type} className="flex items-center gap-2">
            <span
              className="h-[12px] w-[12px] rounded-[2px]"
              style={{ backgroundColor: treemapPalette[index % treemapPalette.length] }}
            />
            <span
              className="text-sm text-[#F5E6C8]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {item.label} ({item.count.toLocaleString()})
            </span>
          </div>
        ))}
      </div>
      <ChartTooltip visible={tooltip.visible} x={tooltip.x} y={tooltip.y}>
        <div className="text-sm leading-tight">
          <div style={{ fontFamily: "'Cinzel', serif" }}>{tooltip.label}</div>
          <div className="mt-1 text-base">
            {tooltip.count.toLocaleString()} places
          </div>
          <div className="text-sm text-[#CBB58B]">
            {tooltip.percentage.toFixed(1)}% of {total.toLocaleString()}
          </div>
        </div>
      </ChartTooltip>
    </div>
  );
}
