export {
  addManagerProduct,
  readDeletedManagerProductIds,
  readManagerProducts,
  removeManagerProduct,
  subscribeManagerProductsUpdates,
  writeManagerProducts,
  type ManagerProductSource,
  type StoredManagerProduct,
} from './managerStorage';
export { getProductBySlug, productCategories, products } from './model/mockProducts';
export { ProductCard } from './ui/ProductCard';
export type { Product, ProductCategory, ProductFilters } from './types';
