'use client';

import { PackageCheck, PackageSearch, Tags } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { ProductCategory } from '@/entities/product';
import type { ProductWithMeta } from '@/entities/product/api';
import { formatDateTime, formatPrice } from '@/shared/lib/formatters';
import { productRoute } from '@/shared/lib/routes';

import { initialFormState, type ManagerFormState } from '../_actions/formState';
import { EmptyState, PanelTitle, StatCard, StatusBadge } from '../_components/ManagerUi';
import styles from '../ManagerPage.module.scss';

type DeleteProductAction = (
  state: ManagerFormState,
  formData: FormData,
) => Promise<ManagerFormState>;

type ProductRow = ProductWithMeta & {
  source: 'backend';
};

type ManagerProductsViewProps = {
  categories: ProductCategory[];
  deleteAction: DeleteProductAction;
  initialProducts: ProductWithMeta[];
};

export function ManagerProductsView({
  categories,
  deleteAction,
  initialProducts,
}: ManagerProductsViewProps) {
  const [productToDelete, setProductToDelete] = useState<ProductRow | null>(null);
  const productRows = useMemo<ProductRow[]>(
    () => initialProducts.map((product) => ({ ...product, source: 'backend' })),
    [initialProducts],
  );
  const availableCount = productRows.filter((product) => product.isAvailable).length;

  return (
    <>
      <section className={`${styles.statsGrid} ${styles.statsGridCompact}`}>
        <StatCard
          icon={<PackageSearch size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Всего товаров"
          value={String(productRows.length)}
        />
        <StatCard
          icon={<PackageCheck size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Доступны"
          value={String(availableCount)}
        />
        <StatCard
          icon={<Tags size={23} strokeWidth={1.6} aria-hidden="true" />}
          label="Категории"
          value={String(categories.length)}
        />
      </section>

      <section className={styles.panel}>
        <PanelTitle title="Список товаров" total={productRows.length} />

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Товар</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Материалы</th>
                <th>Срок</th>
                <th>Статус</th>
                <th>Источник</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {productRows.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <span>{product.description}</span>
                  </td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.materials}</td>
                  <td>{product.term}</td>
                  <td>
                    <StatusBadge
                      label={product.isAvailable ? 'Доступен' : 'Скрыт'}
                      muted={!product.isAvailable}
                    />
                  </td>
                  <td>
                    <StatusBadge label="Backend" />
                    {product.createdAt ? <span>{formatDateTime(product.createdAt)}</span> : null}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={productRoute(product.slug)}>Открыть</Link>
                      <button
                        className={styles.dangerButton}
                        onClick={() => setProductToDelete(product)}
                        type="button"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productRows.length === 0 ? <EmptyState text="Товары пока не добавлены" /> : null}
        </div>
      </section>

      {productToDelete ? (
        <div className={styles.modalOverlay} role="presentation">
          <section
            aria-labelledby="delete-product-title"
            aria-modal="true"
            className={styles.confirmDialog}
            role="dialog"
          >
            <p className={styles.eyebrow}>Подтверждение</p>
            <h2 id="delete-product-title">Вы действительно хотите удалить этот товар?</h2>
            <p className={styles.confirmText}>
              Товар <strong>{productToDelete.name}</strong> будет скрыт в каталоге.
            </p>
            <ProductDeleteForm
              action={deleteAction}
              onCancel={() => setProductToDelete(null)}
              product={productToDelete}
            />
          </section>
        </div>
      ) : null}
    </>
  );
}

function ProductDeleteForm({
  action,
  onCancel,
  product,
}: {
  action: DeleteProductAction;
  onCancel: () => void;
  product: ProductRow;
}) {
  const [state, formAction] = useActionState(action, initialFormState);

  return (
    <form action={formAction}>
      <input name="id" type="hidden" value={product.id} />
      <div className={styles.confirmActions}>
        <button className={styles.secondaryButton} onClick={onCancel} type="button">
          Отмена
        </button>
        <DeleteButton />
      </div>
      {state.message ? <small className={styles.deleteError}>{state.message}</small> : null}
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button className={styles.confirmDangerButton} disabled={pending} type="submit">
      {pending ? 'Удаляем...' : 'Удалить'}
    </button>
  );
}
