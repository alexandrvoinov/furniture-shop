import { routes } from '@/shared/lib/routes';

import type { ProductCategory } from '../types';

export const productCategories: ProductCategory[] = [
  {
    description: 'Фасады, хранение, столешницы и техника в единой композиции.',
    href: `${routes.catalog}?category=kitchens`,
    id: 'kitchens',
    imagePosition: '50% 50%',
    title: 'Кухни',
  },
  {
    description: 'Распашные, купе и встроенные системы под размеры комнаты.',
    href: `${routes.catalog}?category=wardrobes`,
    id: 'wardrobes',
    imagePosition: '76% 50%',
    title: 'Шкафы',
  },
  {
    description: 'Гардеробные, постирочные и скрытые зоны хранения.',
    href: `${routes.catalog}?category=storage`,
    id: 'storage',
    imagePosition: '88% 42%',
    title: 'Гардеробные',
  },
];
