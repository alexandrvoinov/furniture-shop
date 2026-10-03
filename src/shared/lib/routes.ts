export const routes = {
  catalog: '/catalog',
  contacts: '/contacts',
  home: '/',
  process: '/process',
  works: '/catalog',
} as const;

export function productRoute(slug: string) {
  return `/products/${slug}`;
}
