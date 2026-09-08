import { ProductCard, productCategories, products } from '@/entities/product';

import styles from './CatalogPage.module.scss';

export default function CatalogPage() {
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
            <button className={styles.filterButton} type="button">
              Все
            </button>
            {productCategories.map((category) => (
              <button className={styles.filterButton} type="button" key={category.id}>
                {category.title}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
