'use client';

import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  PackageSearch,
  Receipt,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { routes } from '@/shared/lib/routes';

import styles from '../ManagerLayout.module.scss';

type NavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

const items: NavItem[] = [
  { href: routes.manager, icon: LayoutDashboard, label: 'Обзор' },
  { href: routes.managerOrders, icon: ClipboardList, label: 'Заказы' },
  { href: routes.managerClients, icon: Users, label: 'Клиенты' },
  { href: routes.managerProducts, icon: PackageSearch, label: 'Товары' },
  { href: routes.managerPayments, icon: Receipt, label: 'Оплаты' },
  { href: routes.managerDrawings, icon: FileText, label: 'Чертежи' },
];

export function ManagerNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav className={styles.nav} aria-label="Навигация кабинета">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === routes.manager ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            href={item.href}
            key={item.href}
          >
            <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
