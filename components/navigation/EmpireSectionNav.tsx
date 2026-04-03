'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { EmpireConfig } from '@/lib/empires/config';

interface EmpireSectionNavProps {
  empire: EmpireConfig;
}

const NAV_ITEMS = [
  { label: 'Overview', suffix: '' },
  { label: 'Rulers', suffix: '/rulers' },
  { label: 'Map', suffix: '/map' },
  { label: 'Timeline', suffix: '/timeline' },
  { label: 'Territorial', suffix: '/territorial' },
  { label: 'Chapters', suffix: '/chapters' },
  { label: 'Analytics', suffix: '/analytics' },
];

export function EmpireSectionNav({ empire }: EmpireSectionNavProps) {
  const pathname = usePathname();
  const basePath = `/${empire.slug}`;

  return (
    <nav
      aria-label={`${empire.name} sections`}
      className="mb-8 overflow-x-auto pb-2"
    >
      <div className="flex min-w-max gap-2 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-2">
        {NAV_ITEMS.map((item) => {
          const href = `${basePath}${item.suffix}`;
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${empire.color}22`,
                      boxShadow: `inset 0 0 0 1px ${empire.color}`,
                    }
                  : undefined
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
