import { BadgeCheck, ClipboardList, PackageCheck, Ruler, Truck, UserRound } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAuthSession } from '@/entities/auth/server';
import { routes } from '@/shared/lib/routes';

import { ProfileLogoutButton } from './ProfileLogoutButton';
import styles from './ProfilePage.module.scss';

export const metadata: Metadata = {
  title: 'Личный кабинет | Mebel Shop',
};

const orderSteps = [
  { icon: Ruler, label: 'Замер' },
  { icon: ClipboardList, label: 'Проект' },
  { icon: PackageCheck, label: 'Изготовление' },
  { icon: Truck, label: 'Доставка и монтаж' },
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
              Здесь будут отображаться ваши заказы, этапы производства, оплаты и ближайшие действия
              по проекту.
            </p>
          </div>
          <ProfileLogoutButton />
        </section>

        <section className={styles.summaryGrid}>
          <article className={styles.summaryCard}>
            <ClipboardList size={24} strokeWidth={1.6} aria-hidden="true" />
            <span>Активные заказы</span>
            <strong>Пока нет</strong>
            <small>Они появятся после оформления заявки</small>
          </article>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <p className={styles.eyebrow}>Процесс</p>
              <h2>Как проходит заказ</h2>
            </div>
            <div className={styles.steps}>
              {orderSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <div className={styles.step} key={step.label}>
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
                <dt>Телефон</dt>
                <dd>{session.user.phone ?? 'Не указан'}</dd>
              </div>
            </dl>
          </article>
        </section>

        <section className={styles.notice}>
          <BadgeCheck size={21} strokeWidth={1.7} aria-hidden="true" />
          <div>
            <strong>Следующий шаг</strong>
            <p>
              Выберите товар в каталоге или свяжитесь с менеджером. После оформления заявки данные
              заказа появятся в этом кабинете.
            </p>
          </div>
          <Link href={routes.catalog}>Смотреть каталог</Link>
        </section>
      </div>
    </main>
  );
}
