import Link from 'next/link';

import { productCategories } from '@/entities/product';
import { routes } from '@/shared/lib/routes';

import { createProductAction } from '../../_actions/productActions';
import { PageTitle, PanelTitle } from '../../_components/ManagerUi';
import styles from '../../ManagerPage.module.scss';

import { ProductForm } from './ProductForm';

export default function ManagerProductNewPage() {
  return (
    <main className={styles.page}>
      <PageTitle
        action={
          <Link className={styles.secondaryLink} href={routes.managerProducts}>
            Назад к товарам
          </Link>
        }
        eyebrow="Каталог"
        title="Добавить товар"
      />

      <section className={styles.panel}>
        <PanelTitle eyebrow="Новый товар" title="Данные товара" />
        <ProductForm action={createProductAction} categories={productCategories} />
      </section>
    </main>
  );
}
