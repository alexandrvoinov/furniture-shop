import { apiRequest } from '@/shared/api';

import type { Product, ProductFilters, ProductPayload } from './types';

type BackendProduct = {
  badge?: string | null;
  category: string;
  created_at: string;
  description: string;
  dimensions: string;
  id: number;
  image_position: string;
  image_url?: string | null;
  is_available: boolean;
  materials: string;
  name: string;
  old_price?: number | string | null;
  price: number | string;
  slug: string;
  term: string;
  updated_at: string;
};

type BackendProductInput = Omit<BackendProduct, 'created_at' | 'id' | 'updated_at'>;

export type ProductWithMeta = Product & {
  createdAt?: string;
  updatedAt?: string;
};

export const productApi = {
  async create(payload: ProductPayload) {
    const product = await apiRequest<BackendProduct>('/products', {
      body: toBackendProductInput(payload),
      method: 'POST',
    });

    return fromBackendProduct(product);
  },

  async delete(productId: number) {
    await apiRequest<void>(`/products/${productId}`, {
      method: 'DELETE',
    });
  },

  async getBySlug(slug: string) {
    const product = await apiRequest<BackendProduct>(`/products/${slug}`, {
      cache: 'no-store',
    });

    return fromBackendProduct(product);
  },

  async list(filters?: ProductFilters) {
    const products = await apiRequest<BackendProduct[]>('/products', {
      cache: 'no-store',
      query: filters,
    });

    return products.map(fromBackendProduct);
  },

  async listManage(filters?: Pick<ProductFilters, 'limit' | 'offset'>) {
    const products = await apiRequest<BackendProduct[]>('/products/manage/all', {
      cache: 'no-store',
      query: filters,
    });

    return products.map(fromBackendProduct);
  },
};

function fromBackendProduct(product: BackendProduct): ProductWithMeta {
  return {
    badge: product.badge ?? undefined,
    category: product.category,
    createdAt: product.created_at,
    description: product.description,
    dimensions: product.dimensions,
    id: String(product.id),
    imagePosition: product.image_position || '50% 50%',
    imageUrl: product.image_url || '/images/hero-interior.png',
    isAvailable: product.is_available,
    materials: product.materials,
    name: product.name,
    oldPrice: toNumber(product.old_price),
    price: toNumber(product.price) ?? 0,
    slug: product.slug,
    term: product.term,
    updatedAt: product.updated_at,
  };
}

function toBackendProductInput(product: ProductPayload): BackendProductInput {
  return {
    badge: product.badge || null,
    category: product.category,
    description: product.description,
    dimensions: product.dimensions,
    image_position: product.imagePosition || '50% 50%',
    image_url: product.imageUrl || null,
    is_available: product.isAvailable,
    materials: product.materials,
    name: product.name,
    old_price: product.oldPrice ?? null,
    price: product.price,
    slug: product.slug,
    term: product.term,
  };
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}
