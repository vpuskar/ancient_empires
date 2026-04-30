import 'server-only';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function isAdmin(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .limit(1);

  if (error) {
    return false;
  }

  return (data?.length ?? 0) > 0;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const admin = await isAdmin(user.id);

  if (!admin) {
    redirect('/login?error=not_admin');
  }

  return { user };
}
