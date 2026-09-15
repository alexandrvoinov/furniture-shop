import { redirect } from 'next/navigation';

import { getAuthSession, getRedirectPathForSession } from '@/entities/auth/server';
import { routes } from '@/shared/lib/routes';

export default async function CabinetRouterPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect(`${routes.login}?next=${routes.cabinet}`);
  }

  redirect(getRedirectPathForSession(session));
}
