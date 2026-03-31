'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled application error', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0C0B09] text-[#F0ECE2]">
        <main className="flex min-h-screen items-center justify-center px-6 py-16">
          <section className="w-full max-w-xl rounded-2xl border border-[#8B7355]/40 bg-[#171410] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-[#C9A84C]/70 uppercase">
              Unexpected Error
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#F0ECE2]">
              Something went wrong
            </h1>
            <p className="mt-4 text-sm leading-7 text-[#F0ECE2]/70">
              The app hit an unhandled error while rendering this page. You can
              retry now, and the details are logged to the console for follow-up.
            </p>

            {error.digest ? (
              <p className="mt-4 text-xs tracking-[0.2em] text-[#8B7355] uppercase">
                Error digest: {error.digest}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={reset}
                className="rounded-lg border border-[#C9A84C] bg-[#C9A84C]/12 px-5 py-2.5 text-sm font-medium text-[#F6D37B] transition hover:bg-[#C9A84C]/20"
              >
                Try again
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
