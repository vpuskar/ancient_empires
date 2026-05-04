'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { EmpireSelector } from './EmpireSelector';
import { SignOutButton } from './SignOutButton';

interface AdminShellProps {
  userEmail: string;
  children: ReactNode;
}

const navItems = [
  { href: '/admin/chapters', label: 'Chapters' },
  { href: '/admin/quiz', label: 'Quiz Questions' },
] as const;

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentEmpire = searchParams.get('empire') ?? 'roman';

  const buildNavHref = (href: string) =>
    `${href}?empire=${encodeURIComponent(currentEmpire)}`;

  return (
    <div className="flex h-screen">
      <aside
        className={`transition-all duration-200 ${
          sidebarOpen
            ? 'w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col p-4 gap-4'
            : 'w-0 overflow-hidden'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Ancient Empires</div>
            <div className="text-sm text-neutral-500">Admin</div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded hover:bg-neutral-800 text-neutral-400"
            aria-label="Collapse sidebar"
          >
            <span aria-hidden="true">&lt;&lt;</span>
          </button>
        </div>

        <EmpireSelector />

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={buildNavHref(item.href)}
                className={`block px-3 py-2 rounded text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 ${
                  active ? 'bg-neutral-800 text-neutral-100' : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-grow" />

        <footer className="flex flex-col gap-3">
          <div className="truncate text-xs text-neutral-500">{userEmail}</div>
          <SignOutButton />
        </footer>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {!sidebarOpen ? (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="mb-4 p-2 rounded hover:bg-neutral-800 text-neutral-400"
            aria-label="Open sidebar"
          >
            <span aria-hidden="true">&gt;&gt;</span>
          </button>
        ) : null}
        {children}
      </main>
    </div>
  );
}
