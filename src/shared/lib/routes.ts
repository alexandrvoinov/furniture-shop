export const routes = {
  cart: '/cart',
  catalog: '/catalog',
  cabinet: '/cabinet',
  home: '/',
  login: '/login',
  register: '/register',
  manager: '/manager',
  managerClients: '/manager/clients',
  managerClientNew: '/manager/clients/new',
  managerDrawings: '/manager/drawings',
  managerDrawingUpload: '/manager/drawings/upload',
  managerOrders: '/manager/orders',
  managerOrderNew: '/manager/orders/new',
  managerPayments: '/manager/payments',
  managerPaymentNew: '/manager/payments/new',
  managerProducts: '/manager/products',
  managerProductNew: '/manager/products/new',
  profile: '/profile',
} as const;

export function productRoute(slug: string) {
  return `/products/${slug}`;
}

export function managerClientEditRoute(id: number) {
  return `/manager/clients/${id}/edit`;
}

export function managerOrderEditRoute(id: number) {
  return `/manager/orders/${id}/edit`;
}

export function managerOrderRoute(id: number) {
  return `/manager/orders/${id}`;
}

export function managerPaymentEditRoute(id: number) {
  return `/manager/payments/${id}/edit`;
}
