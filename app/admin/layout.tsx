import type { ReactNode } from 'react';
import { requireAdmin } from '@/lib/auth/admin';
import { AdminShell } from './AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AdminShell userEmail={user.email ?? 'Admin'}>{children}</AdminShell>
    </div>
  );
}
