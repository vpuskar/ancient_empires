import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/admin';

export default async function AdminPage() {
  const { user } = await requireAdmin();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
      <p className="text-neutral-400 mb-8">
        Welcome, {user.email}. Pick a section from the sidebar to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        <Link
          href="/admin/chapters"
          className="block p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-800 transition"
        >
          <h2 className="text-lg font-semibold mb-1">Chapters</h2>
          <p className="text-sm text-neutral-400">
            Manage narrative chapters per empire.
          </p>
        </Link>

        <Link
          href="/admin/quiz"
          className="block p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-neutral-800 transition"
        >
          <h2 className="text-lg font-semibold mb-1">Quiz Questions</h2>
          <p className="text-sm text-neutral-400">
            Search, edit, and verify quiz questions across all empires.
          </p>
        </Link>
      </div>
    </div>
  );
}
