import { apiRequest } from '@/shared/api';

import type { Product, ProductFilters } from './types';

export const productApi = {
  getBySlug(slug: string) {
    return apiRequest<Product>(`/products/${slug}`);
  },

  list(filters?: ProductFilters) {
    return apiRequest<Product[]>('/products', {
      query: filters,
    });
  },
};
