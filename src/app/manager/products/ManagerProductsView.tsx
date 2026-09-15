'use client';

import { PackageCheck, PackageSearch, Tags } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  readDeletedManagerProductIds,
  readManagerProducts,
  removeManagerProduct,
  subscribeManagerProductsUpdates,
  type ManagerProductSource,
  type Product,
  type ProductCategory,
  type StoredManagerProduct,
} from '@/entities/product';
import { formatDateTime, formatPrice } from '@/shared/lib/formatters';
import { productRoute } from '@/shared/lib/routes';
import { showToast } from '@/shared/ui/toast';

import { EmptyState, PanelTitle, StatCard, StatusBadge } from '../_components/ManagerUi';
import styles from '../ManagerPage.module.scss';

type ProductRow = Product & {
  createdAt?: string;
  source: ManagerProductSource;
};

type ManagerProductsViewProps = {
  categories: ProductCategory[];
  initialProducts: Product[];
};

export function ManagerProductsView({ categories, initialProducts }: ManagerProductsViewProps) {
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);
  const [manualProducts, setManualProducts] = useState<StoredManagerProduct[]>([]);
  const [productToDelete, setProductToDelete] = useState<ProductRow | null>(null);

  const loadProducts = useCallback(() => {
    setDeletedProductIds(readDeletedManagerProductIds());
    setManualProducts(readManagerProducts());
  }, []);

  useEffect(() => {
    queueMicrotask(loadProducts);

    return subscribeManagerProductsUpdates(loadProducts);
  }, [loadProducts]);

  const productRows = useMemo<ProductRow[]>(() => {
    const deletedIds = new Set(deletedProductIds);

    return [
      ...manualProducts.map((product) => ({ ...product, source: 'manual' as const })),
      ...initialProducts
        .filter((product) => !deletedIds.has(product.id))
        .map((product) => ({ ...product, source: 'catalog' as const })),
    ];
  }, [deletedProductIds, initialProducts, manualProducts]);

  const availableCount = productRows.filter((product) => product.isAvailable).length;

  function handleDeleteProduct() {
    if (!productToDelete) {
      return;
    }

    try {
      removeManagerProduct(productToDelete.id, productToDelete.source);
      showToast({
        message: `Товар ${productToDelete.name} удален`,
        title: 'Товары',
        variant: 'success',
      });
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      showToast({
        message: getErrorMessage(error),
        title: 'Не удалось удалить товар',
        variant: 'error',
      });
    }
  }

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
                <tr key={`${product.source}-${product.id}`}>
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
                    {product.source === 'manual' ? (
                      <>
                        <StatusBadge label="Локально" />
                        {product.createdAt ? (
                          <span>{formatDateTime(product.createdAt)}</span>
                        ) : null}
                      </>
                    ) : (
                      <StatusBadge label="Каталог" muted />
                    )}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      {product.source === 'catalog' ? (
                        <Link href={productRoute(product.slug)}>Открыть</Link>
                      ) : (
                        <span>Черновик</span>
                      )}
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
              Товар <strong>{productToDelete.name}</strong> будет убран из списка товаров в панели.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => setProductToDelete(null)}
                type="button"
              >
                Отмена
              </button>
              <button
                className={styles.confirmDangerButton}
                onClick={handleDeleteProduct}
                type="button"
              >
                Удалить
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Попробуйте удалить товар еще раз.';
}
