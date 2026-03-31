'use client';

import { track } from '@/lib/posthog/track';

interface Props {
  empireSlug: string;
  empireName: string;
  children: React.ReactNode;
}

export function EmpireCardTracker({ empireSlug, empireName, children }: Props) {
  return (
    <div
      onClick={() =>
        track('empire_selected', { empire: empireSlug, name: empireName })
      }
    >
      {children}
    </div>
  );
}
