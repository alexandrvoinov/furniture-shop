import type { Product } from './types';

export type StoredManagerProduct = Product & {
  createdAt: string;
};

export type ManagerProductSource = 'catalog' | 'manual';

export const MANAGER_PRODUCTS_UPDATED_EVENT = 'mebel-shop:manager-products-updated';

const MANAGER_DELETED_PRODUCT_IDS_STORAGE_KEY = 'mebel-shop:manager-deleted-product-ids';
const MANAGER_PRODUCTS_STORAGE_KEY = 'mebel-shop:manager-products';

export function readManagerProducts(): StoredManagerProduct[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(MANAGER_PRODUCTS_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.flatMap((item) => {
      if (!isStoredManagerProduct(item)) {
        return [];
      }

      return [item];
    });
  } catch {
    return [];
  }
}

export function writeManagerProducts(products: StoredManagerProduct[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MANAGER_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(MANAGER_PRODUCTS_UPDATED_EVENT));
}

export function addManagerProduct(product: Product) {
  const nextProduct: StoredManagerProduct = {
    ...product,
    createdAt: new Date().toISOString(),
  };

  writeManagerProducts([nextProduct, ...readManagerProducts()]);
}

export function readDeletedManagerProductIds(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(MANAGER_DELETED_PRODUCT_IDS_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function removeManagerProduct(productId: string, source: ManagerProductSource) {
  if (source === 'manual') {
    writeManagerProducts(readManagerProducts().filter((product) => product.id !== productId));
    return;
  }

  writeDeletedManagerProductIds([...readDeletedManagerProductIds(), productId]);
}

export function subscribeManagerProductsUpdates(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (
      event.key === MANAGER_PRODUCTS_STORAGE_KEY ||
      event.key === MANAGER_DELETED_PRODUCT_IDS_STORAGE_KEY
    ) {
      listener();
    }
  }

  window.addEventListener(MANAGER_PRODUCTS_UPDATED_EVENT, listener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(MANAGER_PRODUCTS_UPDATED_EVENT, listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function isStoredManagerProduct(value: unknown): value is StoredManagerProduct {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const product = value as Partial<StoredManagerProduct>;

  return (
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.category === 'string' &&
    typeof product.description === 'string' &&
    typeof product.dimensions === 'string' &&
    typeof product.imageUrl === 'string' &&
    typeof product.isAvailable === 'boolean' &&
    typeof product.materials === 'string' &&
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    typeof product.term === 'string' &&
    typeof product.createdAt === 'string'
  );
}

function writeDeletedManagerProductIds(productIds: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));

  window.localStorage.setItem(MANAGER_DELETED_PRODUCT_IDS_STORAGE_KEY, JSON.stringify(uniqueIds));
  window.dispatchEvent(new Event(MANAGER_PRODUCTS_UPDATED_EVENT));
}
