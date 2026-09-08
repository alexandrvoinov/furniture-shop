import Link from 'next/link';

import { routes } from '@/shared/lib/routes';

import styles from './Footer.module.scss';

const footerLinks = [
  { href: routes.catalog, label: 'Каталог' },
  { href: `${routes.home}#process`, label: 'Процесс' },
  { href: routes.cart, label: 'Корзина' },
];

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>Mebel Shop</span>
          <span>Кухни, шкафы и гардеробные по индивидуальным размерам.</span>
        </div>
        <nav className={styles.links} aria-label="Навигация в подвале">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
