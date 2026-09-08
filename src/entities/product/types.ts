export type Product = {
  category: string;
  id: string;
  imageUrl?: string;
  isAvailable: boolean;
  name: string;
  oldPrice?: number;
  price: number;
  slug: string;
};

export type ProductFilters = {
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  search?: string;
};
