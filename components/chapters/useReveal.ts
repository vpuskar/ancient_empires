'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import type { RefObject } from 'react';

/**
 * Returns a ref and whether the element is in view.
 * Consumers should build their own motion props from `isInView`.
 */
export function useReveal(): {
  ref: RefObject<HTMLElement | null>;
  isInView: boolean;
} {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' as const });

  return { ref, isInView };
}
