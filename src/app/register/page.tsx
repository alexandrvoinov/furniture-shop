import { Factory, UserPlus } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import {
  getAuthSession,
  getRedirectPathForSession,
  getSafeRedirectPath,
} from '@/entities/auth/server';
import { routes } from '@/shared/lib/routes';

import { RegisterForm } from './RegisterForm';
import styles from '../login/LoginPage.module.scss';

export const metadata: Metadata = {
  title: 'Регистрация | Mebel Shop',
};

type RegisterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = getSafeRedirectPath(getSearchParam(params, 'next'));
  const session = await getAuthSession();

  if (session) {
    redirect(nextPath === routes.cabinet ? getRedirectPathForSession(session) : nextPath);
  }

  return (
    <main className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <section className={styles.visual} aria-label="Регистрация клиента мебельного магазина">
          <Image
            alt="Светлый интерьер кухни с мебелью на заказ"
            className={styles.visualImage}
            fill
            priority
            sizes="(max-width: 920px) 100vw, 52vw"
            src="/images/hero-interior.png"
          />
          <div className={styles.visualOverlay} />
          <div className={styles.visualContent}>
            <span className={styles.visualBadge}>
              <Factory size={18} strokeWidth={1.6} aria-hidden="true" />
              Veema CRM
            </span>
            <h1>Создайте аккаунт для заявок и заказов</h1>
            <p>
              После регистрации вы сможете отслеживать свои заказы, а менеджер при необходимости
              назначит расширенный доступ.
            </p>
          </div>
        </section>

        <section className={styles.panel}>
          <span className={styles.iconMark}>
            <UserPlus size={28} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className={styles.eyebrow}>Аккаунт</p>
          <h2>Регистрация</h2>
          <p className={styles.lead}>
            Новый аккаунт создается как клиентский. Для менеджера или администратора роль
            назначается отдельно на backend.
          </p>

          <RegisterForm redirectTo={nextPath} />

          <p className={styles.panelNote}>
            Нужен доступ менеджера? Зарегистрируйтесь, затем выполните команду роли на backend:
            <code>python -m app.manage_user ваш@email manager</code>.
          </p>

          <Link className={styles.secondaryPanelLink} href={routes.login}>
            Уже есть аккаунт
          </Link>
        </section>
      </div>
    </main>
  );
}

function getSearchParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}
