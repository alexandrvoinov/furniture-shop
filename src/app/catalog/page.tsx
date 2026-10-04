import { Camera, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import {
  getVisibleProductCategories,
  ProductCard,
  productCategories,
  type Product,
} from '@/entities/product';
import { productApi } from '@/entities/product/api';
import { createWhatsappLink } from '@/shared/config/contacts';
import { routes } from '@/shared/lib/routes';

import styles from './CatalogPage.module.scss';

type WorksPageProps = {
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

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const selectedCategoryId = getSearchParamValue(params?.category);
  const selectedCategory = productCategories.find((category) => category.id === selectedCategoryId);
  const allProjects = await loadProjects();
  const visibleCategories = getVisibleProductCategories(allProjects);
  const projects = await loadProjects(selectedCategory?.title);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Наши работы</p>
          <h1>Готовые проекты мебели на заказ с материалами, размерами и сроками</h1>
          <p>
            Здесь не магазин готовых товаров, а портфолио выполненных решений: кухни, шкафы, ТВ-зоны
            и встроенное хранение под конкретные помещения.
          </p>
          <div className={styles.heroActions}>
            <a
              className={styles.primaryButton}
              href={createWhatsappLink(
                'Здравствуйте! Хочу обсудить похожий проект мебели. Могу отправить фото и размеры.',
              )}
              rel="noreferrer"
              target="_blank"
            >
              Обсудить похожий проект
            </a>
            <a
              className={styles.secondaryButton}
              href={createWhatsappLink('Здравствуйте! Хочу обсудить похожий проект мебели.')}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className={styles.catalog}>
        <div className="container">
          <div className={styles.filterBar} aria-label="Фильтры работ">
            <Link
              aria-current={!selectedCategory ? 'page' : undefined}
              className={getFilterClassName(!selectedCategory)}
              href={routes.works}
            >
              Все работы
            </Link>
            {visibleCategories.map((category) => (
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

          {projects.length > 0 ? (
            <div className={styles.grid}>
              {projects.map((project) => (
                <ProductCard key={project.id} product={project} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Camera size={28} strokeWidth={1.6} aria-hidden="true" />
              <h2>Работы пока не добавлены</h2>
              <p>
                Когда backend начнёт отдавать проекты с фото, типом мебели, материалами, размерами,
                сроком и примерной стоимостью, они появятся здесь автоматически.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

async function loadProjects(category?: string): Promise<Product[]> {
  return productApi.list({ category, limit: 100, offset: 0 }).catch(() => []);
}
