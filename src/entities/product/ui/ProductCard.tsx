import { ArrowRight, Clock, Layers, Ruler } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '@/shared/lib/formatters';
import { productRoute } from '@/shared/lib/routes';

import type { Product } from '../types';

import styles from './ProductCard.module.scss';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className={styles.root}>
      <Link
        className={styles.imageLink}
        href={productRoute(product.slug)}
        aria-label={`Открыть проект ${product.name}`}
      >
        <Image
          alt={product.name}
          className={styles.image}
          fill
          sizes="(max-width: 720px) 100vw, 33vw"
          src={product.imageUrl}
        />
        {product.badge ? <span className={styles.badge}>{product.badge}</span> : null}
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{product.category}</span>
          <span>{product.price ? `От ${formatPrice(product.price)}` : 'По запросу'}</span>
        </div>
        <Link className={styles.title} href={productRoute(product.slug)}>
          {product.name}
        </Link>
        <p className={styles.description}>{product.description}</p>

        <dl className={styles.specs}>
          <div>
            <Layers size={16} strokeWidth={1.7} aria-hidden="true" />
            <dt>Материал</dt>
            <dd>{product.materials || 'По проекту'}</dd>
          </div>
          <div>
            <Ruler size={16} strokeWidth={1.7} aria-hidden="true" />
            <dt>Размеры</dt>
            <dd>{product.dimensions || 'Индивидуально'}</dd>
          </div>
          <div>
            <Clock size={16} strokeWidth={1.7} aria-hidden="true" />
            <dt>Срок</dt>
            <dd>{product.term || 'После согласования'}</dd>
          </div>
        </dl>

        <Link className={styles.more} href={productRoute(product.slug)}>
          Подробнее
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
