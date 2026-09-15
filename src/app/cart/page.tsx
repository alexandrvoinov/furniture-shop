import { products } from '@/entities/product';

import { CartView } from './CartView';
import styles from './CartPage.module.scss';

export default function CartPage() {
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
