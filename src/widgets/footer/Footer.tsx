import Image from 'next/image';
import Link from 'next/link';

import { contactConfig, createWhatsappLink } from '@/shared/config/contacts';
import { routes } from '@/shared/lib/routes';

import styles from './Footer.module.scss';

const footerLinks = [
  { href: routes.works, label: 'Наши работы' },
  { href: routes.process, label: 'Как мы работаем' },
  { href: routes.contacts, label: 'Контакты' },
];

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <span className={styles.logoMark}>
              <Image alt="" fill sizes="44px" src="/images/logo.jpg" />
            </span>
            VEEMA ASTANA
          </span>
          <span>Кухни, шкафы и гардеробные по индивидуальным размерам.</span>
        </div>

        <nav className={styles.links} aria-label="Навигация в подвале">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.contacts}>
          <a href={contactConfig.phoneHref}>{contactConfig.phoneDisplay}</a>
          <a
            href={createWhatsappLink('Здравствуйте! Хочу обсудить мебель на заказ.')}
            rel="noreferrer"
            target="_blank"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
