export type StoredCartItem = {
  productId: string;
  quantity: number;
};

export const CART_UPDATED_EVENT = 'mebel-shop:cart-updated';

const CART_STORAGE_KEY = 'mebel-shop:cart';

export function readCartItems(): StoredCartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.flatMap((item) => {
      if (!isStoredCartItem(item)) {
        return [];
      }

      return [
        {
          productId: item.productId,
          quantity: Math.max(1, Math.floor(item.quantity)),
        },
      ];
    });
  } catch {
    return [];
  }
}

export function writeCartItems(items: StoredCartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  const normalizedItems = items
    .filter((item) => item.productId && item.quantity > 0)
    .map((item) => ({
      productId: item.productId,
      quantity: Math.max(1, Math.floor(item.quantity)),
    }));

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedItems));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addCartItem(productId: string, quantity = 1) {
  const items = readCartItems();
  const existingItem = items.find((item) => item.productId === productId);

  if (existingItem) {
    writeCartItems(
      items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
      ),
    );
    return;
  }

  writeCartItems([...items, { productId, quantity }]);
}

export function subscribeCartUpdates(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === CART_STORAGE_KEY) {
      listener();
    }
  }

  window.addEventListener(CART_UPDATED_EVENT, listener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function isStoredCartItem(value: unknown): value is StoredCartItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'productId' in value &&
    'quantity' in value &&
    typeof value.productId === 'string' &&
    typeof value.quantity === 'number' &&
    Number.isFinite(value.quantity)
  );
}
