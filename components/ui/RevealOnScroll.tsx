'use client';

/**
 * RevealOnScroll
 *
 * Framer Motion wrapper that fades + slides content in when it enters viewport.
 * Uses `whileInView` with `once: true` — animates once, then stays visible.
 *
 * Usage:
 *   <RevealOnScroll>
 *     <h2>This fades in on scroll</h2>
 *   </RevealOnScroll>
 *
 *   <RevealOnScroll delay={0.2} direction="left">
 *     <p>Slides in from the left with 200ms delay</p>
 *   </RevealOnScroll>
 */

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealOnScrollProps {
  children: ReactNode;
  /** Delay in seconds before animation starts (default: 0) */
  delay?: number;
  /** Direction of the slide: 'up' | 'down' | 'left' | 'right' (default: 'up') */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Slide distance in pixels (default: 24) */
  distance?: number;
  /** Animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Additional className */
  className?: string;
  /** Viewport amount needed to trigger (default: 0.15) */
  threshold?: number;
}

function getInitialTransform(
  direction: string,
  distance: number
): { x: number; y: number } {
  switch (direction) {
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    case 'up':
    default:
      return { x: 0, y: distance };
  }
}

export function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  distance = 24,
  duration = 0.6,
  className = '',
  threshold = 0.15,
}: RevealOnScrollProps) {
  const { x: initialX, y: initialY } = getInitialTransform(direction, distance);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: initialX,
      y: initialY,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease-out
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
    >
      {children}
    </motion.div>
  );
}
