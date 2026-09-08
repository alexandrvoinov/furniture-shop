export const routes = {
  cart: '/cart',
  catalog: '/catalog',
  home: '/',
} as const;

export function productRoute(slug: string) {
  return `/products/${slug}`;
}
