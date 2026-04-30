import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth/admin';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    const admin = await isAdmin(user.id);

    if (admin) {
      redirect('/admin');
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
        <LoginForm initialError="not_admin" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <LoginForm />
    </main>
  );
}
