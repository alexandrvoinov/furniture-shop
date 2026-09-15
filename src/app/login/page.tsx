import { Factory, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import {
  getAuthSession,
  getDemoCredentialsHint,
  getRedirectPathForSession,
  getSafeRedirectPath,
} from '@/entities/auth/server';

import { LoginForm } from './LoginForm';
import styles from './LoginPage.module.scss';

export const metadata: Metadata = {
  title: 'Вход в кабинет | Mebel Shop',
};

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = getSafeRedirectPath(getSearchParam(params, 'next'));
  const session = await getAuthSession();

  if (session) {
    redirect(nextPath === '/cabinet' ? getRedirectPathForSession(session) : nextPath);
  }

  const demoAccounts = getDemoCredentialsHint();
  const primaryDemo =
    demoAccounts.find((account) => account.role === 'customer') ?? demoAccounts[0];

  return (
    <main className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <section className={styles.visual} aria-label="Рабочий кабинет мебельного производства">
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
            <h1>Кабинет для клиентов и команды производства</h1>
            <p>Клиент видит свои заказы, а администратор управляет производством и оплатами.</p>
          </div>
        </section>

        <section className={styles.panel}>
          <span className={styles.iconMark}>
            <ShieldCheck size={28} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <p className={styles.eyebrow}>Доступ</p>
          <h2>Вход в кабинет</h2>
          <p className={styles.lead}>
            Сейчас используется временный вход для разработки. Потом этот экран подключим к
            настоящим токенам бэкенда.
          </p>

          <LoginForm
            defaultEmail={primaryDemo.email}
            demoPassword={primaryDemo.password}
            redirectTo={nextPath}
          />

          <div className={styles.demoGrid}>
            {demoAccounts.map((account) => (
              <div className={styles.demoBox} key={account.email}>
                <span>{account.label}</span>
                <strong>{account.email}</strong>
                {account.password ? <strong>{account.password}</strong> : null}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function getSearchParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
}
