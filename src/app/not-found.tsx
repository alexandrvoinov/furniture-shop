import Link from 'next/link';

import { createWhatsappLink } from '@/shared/config/contacts';
import { routes } from '@/shared/lib/routes';

import styles from './NotFound.module.scss';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className="container">
        <p className={styles.eyebrow}>404</p>
        <h1 className={styles.title}>Страница не найдена</h1>
        <p className={styles.description}>
          Возможно, ссылка устарела. Перейдите к работам или напишите нам в WhatsApp.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href={routes.works}>
            Наши работы
          </Link>
          <a
            className={styles.secondaryButton}
            href={createWhatsappLink('Здравствуйте! Хочу обсудить мебель на заказ.')}
            rel="noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
