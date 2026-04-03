'use client';

import { useEffect, useId, useRef } from 'react';
import * as d3 from 'd3';

interface RadialVisualizationProps {
  areaKm2: number;
  maxAreaKm2: number;
  label: string;
  empireColor: string;
  capital: string;
  animate?: boolean;
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const parsed = Number.parseInt(value, 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgbaString(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixWithWhite(hex: string, weight: number) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * weight)
      .toString(16)
      .padStart(2, '0');

  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

export function RadialVisualization({
  areaKm2,
  maxAreaKm2,
  label,
  empireColor,
  capital,
  animate = true,
}: RadialVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const uniqueId = useId().replace(/:/g, '');

  useEffect(() => {
    if (!svgRef.current || maxAreaKm2 <= 0) {
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const center = 200;
    const ringCount = 6;
    const maxRadius = 154;
    const ringThickness = 18;
    const gap = 4;
    const filledRings = Math.max(
      1,
      Math.min(ringCount, Math.round((areaKm2 / maxAreaKm2) * ringCount))
    );

    const defs = svg.append('defs');
    const glowId = `${uniqueId}-glow`;

    const glow = defs
      .append('radialGradient')
      .attr('id', glowId)
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    glow
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#B8860B')
      .attr('stop-opacity', 0.35);
    glow
      .append('stop')
      .attr('offset', '48%')
      .attr('stop-color', empireColor)
      .attr('stop-opacity', 0.18);
    glow
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', empireColor)
      .attr('stop-opacity', 0);

    const root = svg
      .append('g')
      .attr('transform', `translate(${center},${center})`);

    root
      .append('line')
      .attr('x1', -174)
      .attr('x2', 174)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', 'rgba(245,230,200,0.08)')
      .attr('stroke-width', 1);

    root
      .append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', -174)
      .attr('y2', 174)
      .attr('stroke', 'rgba(245,230,200,0.08)')
      .attr('stroke-width', 1);

    root.append('circle').attr('r', 76).attr('fill', `url(#${glowId})`);

    const rings = root.append('g');

    for (let index = 0; index < ringCount; index += 1) {
      const ringNumber = ringCount - index;
      const outerRadius = maxRadius - index * (ringThickness + gap);
      const innerRadius = outerRadius - ringThickness;
      const isFilled = ringNumber <= filledRings;
      const fillWeight = index / (ringCount - 1);
      const fillColor = isFilled
        ? mixWithWhite(empireColor, fillWeight * 0.38)
        : 'transparent';
      const fillOpacity = isFilled ? 0.2 + fillWeight * 0.5 : 0;

      rings
        .append('path')
        .attr(
          'd',
          d3.arc()({
            innerRadius,
            outerRadius,
            startAngle: 0,
            endAngle: Math.PI * 2,
          }) ?? ''
        )
        .attr('fill', fillColor)
        .attr('fill-opacity', fillOpacity)
        .attr(
          'stroke',
          isFilled ? rgbaString(empireColor, 0.22) : rgbaString(empireColor, 0.1)
        )
        .attr('stroke-width', 1.2);

      rings
        .append('circle')
        .attr('r', outerRadius)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(184,134,11,0.06)')
        .attr('stroke-width', 1);
    }

    const core = root.append('g');

    core
      .append('circle')
      .attr('r', 44)
      .attr('fill', 'rgba(10,7,5,0.72)')
      .attr('stroke', 'rgba(184,134,11,0.14)')
      .attr('stroke-width', 1);

    core
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -4)
      .attr('fill', '#F5E6C8')
      .attr('font-size', 15)
      .attr('font-family', 'var(--font-display), serif')
      .attr('letter-spacing', '0.22em')
      .text(capital);

    core
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 18)
      .attr('fill', '#B8860B')
      .attr('font-size', 13)
      .attr('font-family', 'var(--font-body), serif')
      .text(`${(areaKm2 / 1_000_000).toFixed(2)}M km2`);

    root
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 182)
      .attr('fill', '#9A8B70')
      .attr('font-size', 12)
      .attr('font-family', 'var(--font-display), serif')
      .attr('letter-spacing', '0.35em')
      .text(label.toUpperCase());

    if (!animate) {
      rings.attr('transform', 'scale(1)');
      rings.attr('opacity', 1);
      return () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }

    const duration = 800;
    const startedAt = performance.now();
    rings.attr('transform', 'scale(0)');
    rings.attr('opacity', 0);

    const frame = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const scale = Math.max(0.001, eased);

      rings.attr('transform', `scale(${scale})`);
      rings.attr('opacity', 0.2 + eased * 0.8);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(frame);
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [animate, areaKm2, capital, empireColor, label, maxAreaKm2, uniqueId]);

  return (
    <div className="mx-auto w-full max-w-[280px] sm:max-w-[400px]">
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        className="h-auto w-full"
        role="img"
        aria-label={`${label} territorial extent`}
      />
    </div>
  );
}
