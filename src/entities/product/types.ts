export type Product = {
  badge?: string;
  category: string;
  description: string;
  dimensions: string;
  id: string;
  imagePosition?: string;
  imageUrl: string;
  isAvailable: boolean;
  materials: string;
  name: string;
  oldPrice?: number;
  price: number;
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

export type ProductPayload = Omit<Product, 'id'>;

export type ProductCategory = {
  description: string;
  href: string;
  id: string;
  imagePosition?: string;
  title: string;
};
