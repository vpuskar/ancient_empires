import { requireAdmin } from '@/lib/auth/admin';

export default async function AdminPage() {
  const { user } = await requireAdmin();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="mt-3 text-neutral-300">{user.email}</p>
      </div>
    </main>
  );
}
