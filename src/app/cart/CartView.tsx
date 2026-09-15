'use client';

import { CreditCard, Minus, Plus, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  readCartItems,
  subscribeCartUpdates,
  type StoredCartItem,
  writeCartItems,
} from '@/entities/cart';
import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib/formatters';
import { routes } from '@/shared/lib/routes';

import styles from './CartPage.module.scss';

type CartLine = {
  product: Product;
  quantity: number;
};

type CartViewProps = {
  products: Product[];
};

export function CartView({ products }: CartViewProps) {
  const [cartLines, setCartLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const loadCart = useCallback(() => {
    setCartLines(resolveCartLines(readCartItems(), productMap));
    setIsReady(true);
  }, [productMap]);

  useEffect(() => {
    queueMicrotask(loadCart);

    return subscribeCartUpdates(loadCart);
  }, [loadCart]);

  const cartTotals = useMemo(() => {
    return cartLines.reduce(
      (totals, line) => ({
        itemsCount: totals.itemsCount + line.quantity,
        subtotal: totals.subtotal + line.product.price * line.quantity,
      }),
      { itemsCount: 0, subtotal: 0 },
    );
  }, [cartLines]);

  function persistCart(nextLines: CartLine[]) {
    setCartLines(nextLines);
    writeCartItems(
      nextLines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
      })),
    );
  }

  function increment(productId: string) {
    persistCart(
      cartLines.map((line) =>
        line.product.id === productId ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    );
  }

  function decrement(productId: string) {
    persistCart(
      cartLines.flatMap((line) => {
        if (line.product.id !== productId) {
          return [line];
        }

        if (line.quantity <= 1) {
          return [];
        }

        return [{ ...line, quantity: line.quantity - 1 }];
      }),
    );
  }

  function removeItem(productId: string) {
    persistCart(cartLines.filter((line) => line.product.id !== productId));
  }

  return (
    <div className={styles.layout}>
      <div className={styles.items}>
        {!isReady ? (
          <div className={styles.emptyState}>
            <h2>Загружаем корзину</h2>
            <p>Проверяем товары, которые вы добавили ранее.</p>
          </div>
        ) : null}

        {isReady && cartLines.length > 0
          ? cartLines.map(({ product, quantity }) => {
              const lineTotal = product.price * quantity;

              return (
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
                    <button
                      onClick={() => decrement(product.id)}
                      type="button"
                      aria-label={
                        quantity === 1
                          ? `Удалить ${product.name} из корзины`
                          : `Уменьшить количество ${product.name}`
                      }
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => increment(product.id)}
                      type="button"
                      aria-label={`Увеличить количество ${product.name}`}
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <div className={styles.linePrice}>
                    <strong>{formatPrice(lineTotal)}</strong>
                    {quantity > 1 ? <span>{formatPrice(product.price)} за шт.</span> : null}
                  </div>
                  <button
                    className={styles.trashButton}
                    onClick={() => removeItem(product.id)}
                    type="button"
                    aria-label={`Удалить ${product.name}`}
                  >
                    <Trash size={18} strokeWidth={1.7} aria-hidden="true" />
                  </button>
                </article>
              );
            })
          : null}

        {isReady && cartLines.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Корзина пуста</h2>
            <p>Добавьте мебель из каталога, чтобы отправить заявку на расчет проекта.</p>
            <Link href={routes.catalog}>Перейти в каталог</Link>
          </div>
        ) : null}
      </div>

      <aside className={styles.summary}>
        <h2>Итого</h2>
        <dl>
          <div>
            <dt>Товары</dt>
            <dd>{formatPrice(cartTotals.subtotal)}</dd>
          </div>
          <div>
            <dt>Позиций</dt>
            <dd>{cartTotals.itemsCount}</dd>
          </div>
          <div>
            <dt>Замер</dt>
            <dd>по заявке</dd>
          </div>
          <div>
            <dt>Доставка</dt>
            <dd>после расчета</dd>
          </div>
        </dl>
        <div className={styles.total}>
          <span>Предварительно</span>
          <strong>{formatPrice(cartTotals.subtotal)}</strong>
        </div>
        <button
          className={styles.checkoutButton}
          disabled={!isReady || cartLines.length === 0}
          type="button"
        >
          <CreditCard size={18} strokeWidth={1.7} aria-hidden="true" />
          Оформить заявку
        </button>
        <p className={styles.note}>
          <ShieldCheck size={18} strokeWidth={1.7} aria-hidden="true" />
          Финальная стоимость уточняется после замера и проекта.
        </p>
      </aside>
    </div>
  );
}

function resolveCartLines(items: StoredCartItem[], productMap: Map<string, Product>): CartLine[] {
  return items.flatMap((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      return [];
    }

    return [
      {
        product,
        quantity: item.quantity,
      },
    ];
  });
}
