import { routes } from '@/shared/lib/routes';

import type { Product, ProductCategory } from '../types';

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

export const products: Product[] = [
  {
    badge: 'Хит',
    category: 'Кухни',
    description: 'Светлая кухня с древесным верхом, островом и мягкими винными акцентами.',
    dimensions: 'от 8 м²',
    id: '1',
    imagePosition: '50% 50%',
    imageUrl: '/images/hero-interior.png',
    isAvailable: true,
    materials: 'МДФ эмаль, шпон дуба, кварц',
    name: 'Кухня Alba',
    oldPrice: 680000,
    price: 590000,
    slug: 'kitchen-alba',
    term: '45 дней',
  },
  {
    badge: 'На заказ',
    category: 'Шкафы',
    description: 'Встроенный шкаф во всю стену с подсветкой, нишами и спокойной геометрией.',
    dimensions: 'до потолка',
    id: '2',
    imagePosition: '78% 50%',
    imageUrl: '/images/hero-interior.png',
    isAvailable: true,
    materials: 'ЛДСП Egger, алюминиевый профиль',
    name: 'Шкаф Linea',
    price: 240000,
    slug: 'wardrobe-linea',
    term: '30 дней',
  },
  {
    category: 'Гардеробные',
    description: 'Система хранения с открытыми секциями, закрытыми модулями и точной эргономикой.',
    dimensions: 'от 4 м²',
    id: '3',
    imagePosition: '90% 44%',
    imageUrl: '/images/hero-interior.png',
    isAvailable: true,
    materials: 'ЛДСП, стекло, скрытая фурнитура',
    name: 'Гардеробная Forma',
    price: 310000,
    slug: 'closet-forma',
    term: '35 дней',
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
