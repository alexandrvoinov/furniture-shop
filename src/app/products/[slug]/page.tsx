import { BadgeCheck, Clock, Ruler, ShieldCheck, Truck } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getProductBySlug, products } from '@/entities/product';
import { formatPrice } from '@/shared/lib/formatters';

import styles from './ProductPage.module.scss';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <section className={`container ${styles.product}`}>
        <div className={styles.gallery}>
          <Image
            alt={product.name}
            className={styles.image}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 54vw"
            src={product.imageUrl}
            style={{ objectPosition: product.imagePosition }}
          />
        </div>

        <div className={styles.info}>
          <p className={styles.eyebrow}>{product.category}</p>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.oldPrice ? (
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
            ) : null}
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} type="button">
              Добавить в корзину
            </button>
            <button className={styles.secondaryButton} type="button">
              Рассчитать проект
            </button>
          </div>

          <dl className={styles.specs}>
            <div>
              <Ruler size={20} strokeWidth={1.6} aria-hidden="true" />
              <dt>Размер</dt>
              <dd>{product.dimensions}</dd>
            </div>
            <div>
              <Clock size={20} strokeWidth={1.6} aria-hidden="true" />
              <dt>Срок</dt>
              <dd>{product.term}</dd>
            </div>
            <div>
              <BadgeCheck size={20} strokeWidth={1.6} aria-hidden="true" />
              <dt>Материалы</dt>
              <dd>{product.materials}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.service}>
        <div className={`container ${styles.serviceInner}`}>
          <article>
            <ShieldCheck size={28} strokeWidth={1.5} aria-hidden="true" />
            <h2>Индивидуальное изготовление</h2>
            <p>Проект адаптируется под помещение, хранение, фасады, технику и монтажные узлы.</p>
          </article>
          <article>
            <Truck size={28} strokeWidth={1.5} aria-hidden="true" />
            <h2>Доставка и монтаж</h2>
            <p>
              После производства мебель привозят на объект и устанавливают в согласованные сроки.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}
