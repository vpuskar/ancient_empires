'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type LoginFormProps = {
  initialError?: 'not_admin';
};

export function LoginForm({ initialError }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showNotAuthorized =
    initialError === 'not_admin' || searchParams.get('error') === 'not_admin';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.refresh();
    router.push('/admin');
  }

  return (
    <form
      className="max-w-sm mx-auto p-6 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-100"
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-medium">Admin Login</h1>
        </div>

        {showNotAuthorized ? (
          <div className="text-amber-400 text-sm border border-amber-900 bg-amber-950 p-2 rounded">
            Not authorized
          </div>
        ) : null}

        {error ? <div className="text-red-400 text-sm">{error}</div> : null}

        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input
            className="w-full p-2 rounded border border-neutral-700 bg-neutral-800 text-neutral-100"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        <button
          className="w-full py-2 rounded bg-neutral-100 text-neutral-900 font-medium hover:bg-neutral-200 disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
