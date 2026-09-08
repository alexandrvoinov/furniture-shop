import { ArrowRight } from 'lucide-react';
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
        aria-label={product.name}
      >
        <Image
          alt={product.name}
          className={styles.image}
          fill
          sizes="(max-width: 720px) 100vw, 33vw"
          src={product.imageUrl}
          style={{ objectPosition: product.imagePosition }}
        />
        {product.badge ? <span className={styles.badge}>{product.badge}</span> : null}
      </Link>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{product.category}</span>
          <span>{product.term}</span>
        </div>
        <Link className={styles.title} href={productRoute(product.slug)}>
          {product.name}
        </Link>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <div>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.oldPrice ? (
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
            ) : null}
          </div>
          <Link
            className={styles.more}
            href={productRoute(product.slug)}
            aria-label={`Открыть ${product.name}`}
          >
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
