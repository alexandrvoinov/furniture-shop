import Link from 'next/link';

import {
  ProductCard,
  productCategories,
  products as fallbackProducts,
  type Product,
} from '@/entities/product';
import { productApi } from '@/entities/product/api';
import { routes } from '@/shared/lib/routes';

import styles from './CatalogPage.module.scss';

type CatalogPageProps = {
  searchParams?: Promise<{
    category?: string | string[];
  }>;
};

const getSearchParamValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] : value;
};

const getFilterClassName = (isActive: boolean) => {
  return isActive ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const selectedCategoryId = getSearchParamValue(params?.category);
  const selectedCategory = productCategories.find((category) => category.id === selectedCategoryId);
  const filteredProducts = await loadCatalogProducts(selectedCategory?.title);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Каталог</p>
          <h1>Мебель под размеры, материалы и сценарии жизни</h1>
          <p>
            Выберите направление, сравните решения и отправьте заявку на расчет проекта под ваше
            помещение.
          </p>
        </div>
      </section>

      <section className={styles.catalog}>
        <div className="container">
          <div className={styles.filterBar} aria-label="Фильтры каталога">
            <Link
              aria-current={!selectedCategory ? 'page' : undefined}
              className={getFilterClassName(!selectedCategory)}
              href={routes.catalog}
            >
              Все
            </Link>
            {productCategories.map((category) => (
              <Link
                aria-current={selectedCategory?.id === category.id ? 'page' : undefined}
                className={getFilterClassName(selectedCategory?.id === category.id)}
                href={category.href}
                key={category.id}
              >
                {category.title}
              </Link>
            ))}
          </div>

          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

async function loadCatalogProducts(category?: string): Promise<Product[]> {
  const apiProducts = await productApi.list({ category, limit: 100, offset: 0 }).catch(() => []);

  if (apiProducts.length > 0) {
    return apiProducts;
  }

  return category
    ? fallbackProducts.filter((product) => product.category === category)
    : fallbackProducts;
}
