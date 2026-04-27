'use client';

import Link from 'next/link';
import { EMPIRE_CONFIGS } from '@/lib/empires/config';

const quizLinkColor = EMPIRE_CONFIGS.find((empire) => empire.id === 4)?.color;

export default function CompareCanvas() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-2">
          {EMPIRE_CONFIGS.map((empire) => (
            <span
              key={empire.id}
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: empire.color }}
            />
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal text-stone-950">
            Which empire claims you?
          </h2>
          <p className="text-sm text-stone-600">
            A reflective 10-question personality quiz across Rome, China, Japan,
            and the Ottoman world.
          </p>
        </div>

        <Link
          href="/compare/personality"
          className="mt-5 inline-flex text-sm font-medium"
          style={{ color: quizLinkColor }}
        >
          Take the quiz →
        </Link>
      </div>
    </div>
  );
}
