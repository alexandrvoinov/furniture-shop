import type { SiteMedia } from '@/entities/site-content';

export type Product = {
  badge?: string;
  category: string;
  description: string;
  dimensions: string;
  id: string;
  imageUrl: string;
  isAvailable: boolean;
  media?: SiteMedia[];
  materials: string;
  name: string;
  oldPrice?: number;
  price?: number;
  slug: string;
  term: string;
};

export type ProductFilters = {
  category?: string;
  limit?: number;
  maxPrice?: number;
  minPrice?: number;
  offset?: number;
  search?: string;
};

export type ProductCategory = {
  description: string;
  href: string;
  id: string;
  title: string;
};
