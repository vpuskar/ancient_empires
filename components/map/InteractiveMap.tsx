'use client';

import dynamic from 'next/dynamic';
import type { EmpireConfig } from '@/lib/empires/config';
import MapErrorBoundary from './MapErrorBoundary';

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

function MapLoadingSkeleton() {
  return (
    <div className="relative mx-6 h-[calc(100vh-140px)] overflow-hidden rounded-lg border border-[#8B7355] bg-[#1a1815]">
      {/* Parchment texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2520]/40 via-transparent to-[#1a1510]/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#8B7355] border-t-[#C9A84C]" />
        <p className="text-sm tracking-widest text-[#8B7355] uppercase">
          Loading map&hellip;
        </p>
      </div>
    </div>
  );
}

export default function InteractiveMap({ empire }: { empire: EmpireConfig }) {
  return (
    <MapErrorBoundary>
      <MapInner empire={empire} />
    </MapErrorBoundary>
  );
}
