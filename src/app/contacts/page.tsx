import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { contactConfig, createWhatsappLink } from '@/shared/config/contacts';
import { routes } from '@/shared/lib/routes';

import styles from './ContactsPage.module.scss';

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Контакты</p>
          <h1>Напишите нам, чтобы обсудить мебель, замер или ориентир по стоимости</h1>
          <p>
            Быстрее всего отвечаем в WhatsApp. Можно прислать фото помещения, размеры или референс.
          </p>
        </div>
      </section>

      <section className={styles.contacts}>
        <div className={`container ${styles.grid}`}>
          <article className={styles.contactCard}>
            <Phone size={28} strokeWidth={1.6} aria-hidden="true" />
            <h2>Телефон</h2>
            <a href={contactConfig.phoneHref}>{contactConfig.phoneDisplay}</a>
          </article>
          <article className={styles.contactCard}>
            <MessageCircle size={28} strokeWidth={1.6} aria-hidden="true" />
            <h2>WhatsApp</h2>
            <a
              href={createWhatsappLink('Здравствуйте! Хочу обсудить мебель на заказ.')}
              rel="noreferrer"
              target="_blank"
            >
              Написать в WhatsApp
            </a>
          </article>
          <article className={styles.contactCard}>
            <ExternalLink size={28} strokeWidth={1.6} aria-hidden="true" />
            <h2>Instagram</h2>
            <a href={contactConfig.instagramUrl} rel="noreferrer" target="_blank">
              Смотреть работы
            </a>
          </article>
          <article className={styles.contactCard}>
            <Mail size={28} strokeWidth={1.6} aria-hidden="true" />
            <h2>Email</h2>
            <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
          </article>
        </div>
      </section>

      <section className={styles.location}>
        <div className={`container ${styles.locationInner}`}>
          <div>
            <MapPin size={30} strokeWidth={1.6} aria-hidden="true" />
            <h2>{contactConfig.address}</h2>
            <p>
              Работаем с проектами мебели на заказ: кухни, шкафы, ТВ-зоны, встроенное хранение,
              тумбы и индивидуальные решения.
            </p>
          </div>
          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={createWhatsappLink(
                'Здравствуйте! Хочу обсудить мебель на заказ и отправить фото помещения.',
              )}
              rel="noreferrer"
              target="_blank"
            >
              Написать в WhatsApp
            </a>
            <Link className={styles.secondaryButton} href={routes.works}>
              Посмотреть работы
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
