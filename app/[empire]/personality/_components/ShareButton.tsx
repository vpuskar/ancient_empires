'use client';

import { useEffect, useRef, useState } from 'react';

interface ShareButtonProps {
  rulerName: string;
  rulerTitle: string;
  empireSlug: string;
  empireColor: string;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ShareButton({
  rulerName,
  rulerTitle,
  empireSlug,
  empireColor,
}: ShareButtonProps) {
  const [label, setLabel] = useState('Share Result');
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const setTemporaryLabel = (nextLabel: string) => {
    setLabel(nextLabel);

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setLabel('Share Result');
      resetTimeoutRef.current = null;
    }, 2000);
  };

  const handleShare = async () => {
    const text = `I'm ${rulerName} - ${rulerTitle}! Which ruler are you?`;
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/${empireSlug}/personality`
        : `/${empireSlug}/personality`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Ancient Empires Personality Quiz',
          text,
          url,
        });
      } catch {
        return;
      }

      return;
    }

    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setTemporaryLabel('Copied!');
      } catch {
        setTemporaryLabel('Copy unavailable');
      }

      return;
    }

    setTemporaryLabel('Copy unavailable');
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-[8px] px-7 py-[11px] font-display text-[12px] uppercase tracking-[0.2em] text-[#F5E6C8]"
      style={{
        background: `linear-gradient(135deg, ${empireColor}, rgba(184,134,11,0.95))`,
        boxShadow: `0 14px 30px ${hexToRgba(empireColor, 0.2)}`,
      }}
    >
      {label}
    </button>
  );
}
