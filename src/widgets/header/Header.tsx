import Link from 'next/link';

import { routes } from '@/shared/lib/routes';
import { Input } from '@/shared/ui/input/Input';

import styles from './Header.module.scss';

const navItems = [
  { href: routes.catalog, label: 'Каталог' },
  { href: routes.cart, label: 'Корзина' },
];

export function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link className={styles.logo} href={routes.home}>
          Mebel Shop
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {navItems.map((item) => (
            <Link className={styles.navLink} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.search}>
          <Input aria-label="Поиск по магазину" placeholder="Поиск мебели" />
        </div>
      </div>
    </header>
  );
}
