import { products as fallbackProducts, type Product } from '@/entities/product';
import { productApi } from '@/entities/product/api';

import { CartView } from './CartView';
import styles from './CartPage.module.scss';

export default async function CartPage() {
  const products = await loadCartProducts();

  return (
    <main className={styles.page}>
      <section className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Корзина</p>
          <h1>Заказ на индивидуальную мебель</h1>
        </div>

        <CartView products={products} />
      </section>
    </main>
  );
}

async function loadCartProducts(): Promise<Product[]> {
  const apiProducts = await productApi.list({ limit: 100, offset: 0 }).catch(() => []);

  return apiProducts.length > 0 ? apiProducts : fallbackProducts;
}
