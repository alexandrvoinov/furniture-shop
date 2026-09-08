import { CreditCard, Minus, Plus, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';

import { products } from '@/entities/product';
import { formatPrice } from '@/shared/lib/formatters';

import styles from './CartPage.module.scss';

export default function CartPage() {
  const cartItems = products.slice(0, 2);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price, 0);

  return (
    <main className={styles.page}>
      <section className="container">
        <div className={styles.header}>
          <p className={styles.eyebrow}>Корзина</p>
          <h1>Заказ на индивидуальную мебель</h1>
        </div>

        <div className={styles.layout}>
          <div className={styles.items}>
            {cartItems.map((product) => (
              <article className={styles.item} key={product.id}>
                <div className={styles.imageWrap}>
                  <Image
                    alt={product.name}
                    fill
                    sizes="140px"
                    src={product.imageUrl}
                    style={{ objectPosition: product.imagePosition }}
                  />
                </div>
                <div className={styles.itemInfo}>
                  <span>{product.category}</span>
                  <h2>{product.name}</h2>
                  <p>{product.materials}</p>
                </div>
                <div className={styles.counter} aria-label={`Количество ${product.name}`}>
                  <button type="button" aria-label="Уменьшить количество">
                    <Minus size={16} aria-hidden="true" />
                  </button>
                  <span>1</span>
                  <button type="button" aria-label="Увеличить количество">
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
                <strong>{formatPrice(product.price)}</strong>
                <button className={styles.trashButton} type="button" aria-label="Удалить товар">
                  <Trash size={18} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>

          <aside className={styles.summary}>
            <h2>Итого</h2>
            <dl>
              <div>
                <dt>Товары</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>Замер</dt>
                <dd>по заявке</dd>
              </div>
              <div>
                <dt>Доставка</dt>
                <dd>после расчёта</dd>
              </div>
            </dl>
            <div className={styles.total}>
              <span>Предварительно</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <button className={styles.checkoutButton} type="button">
              <CreditCard size={18} strokeWidth={1.7} aria-hidden="true" />
              Оформить заявку
            </button>
            <p className={styles.note}>
              <ShieldCheck size={18} strokeWidth={1.7} aria-hidden="true" />
              Финальная стоимость уточняется после замера и проекта.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
