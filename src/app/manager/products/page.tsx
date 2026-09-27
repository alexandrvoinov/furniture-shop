import Link from 'next/link';

import { productCategories } from '@/entities/product';
import { productApi, type ProductWithMeta } from '@/entities/product/api';
import { routes } from '@/shared/lib/routes';

import { deleteProductAction } from '../_actions/productActions';
import { ApiNotice, PageTitle } from '../_components/ManagerUi';
import styles from '../ManagerPage.module.scss';

import { ManagerProductsView } from './ManagerProductsView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ManagerProductsPage() {
  const results = await Promise.allSettled([productApi.listManage({ limit: 100, offset: 0 })]);
  const errors: string[] = [];
  const products = pickProducts(results[0], errors);

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
      <ApiNotice errors={errors} />

      <ManagerProductsView
        categories={productCategories}
        deleteAction={deleteProductAction}
        initialProducts={products}
      />
    </main>
  );
}

function pickProducts(
  result: PromiseSettledResult<ProductWithMeta[]>,
  errors: string[],
): ProductWithMeta[] {
  if (result.status === 'fulfilled') {
    return result.value;
  }

  errors.push('products');
  return [];
}
