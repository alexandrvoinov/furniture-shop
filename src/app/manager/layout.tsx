import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getAuthSession } from '@/entities/auth/server';
import { AUTH_CUSTOMER_REDIRECT } from '@/shared/lib/auth';
import { routes } from '@/shared/lib/routes';

import { LogoutButton } from './_components/LogoutButton';
import { ManagerNav } from './_components/ManagerNav';
import styles from './ManagerLayout.module.scss';

export default async function ManagerLayout({ children }: { children: ReactNode }) {
  const session = await getAuthSession();

  if (!session) {
    redirect(`${routes.login}?next=${routes.manager}`);
  }

  if (session.user.role === 'customer') {
    redirect(AUTH_CUSTOMER_REDIRECT);
  }

  return (
    <div className={styles.manager}>
      <div className={`container ${styles.shell}`}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHead}>
            <span>Veema CRM</span>
            <strong>рабочий кабинет</strong>
          </div>
          <ManagerNav />
          <div className={styles.userCard}>
            <span>Доступ</span>
            <strong>{session.user.name}</strong>
            <small>{session.user.email}</small>
            <LogoutButton />
          </div>
          <div className={styles.sidebarNote}>
            <span>Данные</span>
            <strong>Backend API</strong>
          </div>
        </aside>
        <div className={styles.workspace}>{children}</div>
      </div>
    </div>
  );
}
