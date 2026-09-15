'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { logout } from '@/entities/auth';
import { routes } from '@/shared/lib/routes';

import styles from '../ManagerLayout.module.scss';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await logout();
      router.replace(routes.login);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      className={styles.logoutButton}
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
      {isPending ? 'Выходим...' : 'Выйти'}
    </button>
  );
}
