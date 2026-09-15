import Link from 'next/link';

import { productCategories, products } from '@/entities/product';
import { routes } from '@/shared/lib/routes';

import { PageTitle } from '../_components/ManagerUi';
import styles from '../ManagerPage.module.scss';

import { ManagerProductsView } from './ManagerProductsView';

export default function ManagerProductsPage() {
  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <Link className={styles.actionLink} href={routes.managerProductNew}>
            Добавить товар
          </Link>
        }
        eyebrow="Каталог"
        title="Товары"
      />

      <ManagerProductsView categories={productCategories} initialProducts={products} />
    </main>
  );
}
