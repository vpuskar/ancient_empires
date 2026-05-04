'use client';

import type { ChangeEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';

export function EmpireSelector() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentEmpire = searchParams.get('empire') ?? 'roman';

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('empire', event.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-neutral-500">
        Empire
      </span>
      <select
        value={currentEmpire}
        onChange={handleChange}
        className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
      >
        {EMPIRE_CONFIGS.map((empire) => (
          <option key={empire.slug} value={empire.slug}>
            {empire.name}
          </option>
        ))}
      </select>
    </label>
  );
}
