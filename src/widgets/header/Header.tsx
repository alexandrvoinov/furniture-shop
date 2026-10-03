import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { contactConfig, createWhatsappLink } from '@/shared/config/contacts';
import { routes } from '@/shared/lib/routes';

import styles from './Header.module.scss';

const navItems = [
  { href: routes.home, label: 'Главная' },
  { href: routes.works, label: 'Наши работы' },
  { href: routes.process, label: 'Как мы работаем' },
  { href: routes.contacts, label: 'Контакты' },
];

export function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link className={styles.logo} href={routes.home} aria-label="VEEMA ASTANA">
          <span className={styles.logoMark}>
            <Image alt="" fill priority sizes="48px" src="/images/logo.jpg" />
          </span>
          <span>
            VEEMA ASTANA
            <small>Мебель на заказ</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link className={styles.navLink} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <a className={styles.phoneLink} href={contactConfig.phoneHref}>
            {contactConfig.phoneDisplay}
          </a>
          <a
            className={styles.whatsappButton}
            href={createWhatsappLink('Здравствуйте! Хочу обсудить мебель на заказ.')}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
