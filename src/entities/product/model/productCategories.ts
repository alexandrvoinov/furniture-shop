import { routes } from '@/shared/lib/routes';

import type { ProductCategory } from '../types';

export const productCategories: ProductCategory[] = [
  {
    description: 'Фасады, столешницы, техника и хранение в единой композиции под размеры кухни.',
    href: `${routes.works}?category=kitchens`,
    id: 'kitchens',
    title: 'Кухни',
  },
  {
    description: 'Распашные, купе и встроенные системы, которые используют каждый сантиметр.',
    href: `${routes.works}?category=wardrobes`,
    id: 'wardrobes',
    title: 'Шкафы',
  },
  {
    description: 'Гардеробные, постирочные и скрытые зоны хранения с продуманным наполнением.',
    href: `${routes.works}?category=storage`,
    id: 'storage',
    title: 'Гардеробные',
  },
];
