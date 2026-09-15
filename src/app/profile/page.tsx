import {
  BadgeCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  PackageCheck,
  Ruler,
  Truck,
  UserRound,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAuthSession } from '@/entities/auth/server';
import { formatPrice } from '@/shared/lib/formatters';
import { routes } from '@/shared/lib/routes';

import { ProfileLogoutButton } from './ProfileLogoutButton';
import styles from './ProfilePage.module.scss';

export const metadata: Metadata = {
  title: 'Личный кабинет | Mebel Shop',
};

const orderSteps = [
  { icon: Ruler, isDone: true, label: 'Замер выполнен' },
  { icon: ClipboardList, isDone: true, label: 'Проект согласован' },
  { icon: PackageCheck, isDone: false, label: 'Изготовление' },
  { icon: Truck, isDone: false, label: 'Доставка и монтаж' },
];

export default async function ProfilePage() {
  const session = await getAuthSession();

  if (!session) {
    redirect(`${routes.login}?next=${routes.profile}`);
  }

  return (
    <main className={styles.page}>
      <div className={`container ${styles.shell}`}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Личный кабинет</p>
            <h1>Здравствуйте, {session.user.name}</h1>
            <p className={styles.lead}>
              Здесь клиент видит свой заказ, этап производства, оплату и ближайшие действия по
              проекту.
            </p>
          </div>
          <ProfileLogoutButton />
        </section>

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <ClipboardList size={24} strokeWidth={1.6} aria-hidden="true" />
            <span>Текущий заказ</span>
            <strong>Кухня Alba</strong>
            <small>Заказ #104</small>
          </article>
          <article className={styles.summaryCard}>
            <CreditCard size={24} strokeWidth={1.6} aria-hidden="true" />
            <span>Оплачено</span>
            <strong>{formatPrice(450000)}</strong>
            <small>Остаток: {formatPrice(1000000)}</small>
          </article>
          <article className={styles.summaryCard}>
            <CalendarDays size={24} strokeWidth={1.6} aria-hidden="true" />
            <span>Ориентир монтажа</span>
            <strong>26 сентября</strong>
            <small>После готовности цеха</small>
          </article>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.eyebrow}>Статус</p>
              <h2>Проект в производстве</h2>
            </div>
            <div className={styles.steps}>
              {orderSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    className={step.isDone ? `${styles.step} ${styles.stepDone}` : styles.step}
                    key={step.label}
                  >
                    <span>
                      <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <strong>{step.label}</strong>
                  </div>
                );
              })}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.eyebrow}>Данные клиента</p>
              <h2>Контакты</h2>
            </div>
            <dl className={styles.details}>
              <div>
                <dt>
                  <UserRound size={17} strokeWidth={1.7} aria-hidden="true" />
                  Имя
                </dt>
                <dd>{session.user.name}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt>Адрес проекта</dt>
                <dd>Алматы, ЖК Central Park</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className={styles.notice}>
          <BadgeCheck size={21} strokeWidth={1.7} aria-hidden="true" />
          <div>
            <strong>Следующий шаг</strong>
            <p>
              После подключения бэкенда эти данные будут приходить из личного профиля клиента и его
              заказов. Сейчас это тестовый экран для проверки пользовательской роли.
            </p>
          </div>
          <Link href={routes.catalog}>Смотреть каталог</Link>
        </section>
      </div>
    </main>
  );
}
