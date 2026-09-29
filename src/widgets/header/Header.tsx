import { CircleUserRound, LogIn, Search, ShoppingBag, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { getAuthSession } from '@/entities/auth/server';
import { getDefaultRouteByRole } from '@/shared/lib/auth';
import { routes } from '@/shared/lib/routes';
import { Input } from '@/shared/ui/input/Input';

import styles from './Header.module.scss';

const navItems = [
  { href: routes.home, label: 'Главная' },
  { href: routes.catalog, label: 'Каталог' },
  { href: `${routes.home}#process`, label: 'Процесс' },
  { href: routes.cabinet, label: 'Кабинет' },
];

export async function Header() {
  const session = await getAuthSession();
  const profileHref = getDefaultRouteByRole(session?.user.role);

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link className={styles.logo} href={routes.home}>
          <span className={styles.logoMark} aria-hidden="true">
            M
          </span>
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
          <Search className={styles.searchIcon} size={18} strokeWidth={1.7} aria-hidden="true" />
          <Input aria-label="Поиск по магазину" placeholder="Поиск мебели" />
        </div>

        <div className={styles.actions}>
          {session ? (
            <Link
              aria-label={`Открыть кабинет: ${session.user.name}`}
              className={styles.profileButton}
              href={profileHref}
            >
              <CircleUserRound size={21} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          ) : (
            <>
              <Link className={styles.authLink} href={routes.login}>
                <LogIn size={17} strokeWidth={1.7} aria-hidden="true" />
                Войти
              </Link>
              <Link
                className={`${styles.authLink} ${styles.authLinkPrimary}`}
                href={routes.register}
              >
                <UserPlus size={17} strokeWidth={1.7} aria-hidden="true" />
                Регистрация
              </Link>
            </>
          )}
          <Link className={styles.cartButton} href={routes.cart} aria-label="Корзина">
            <ShoppingBag size={20} strokeWidth={1.7} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}
