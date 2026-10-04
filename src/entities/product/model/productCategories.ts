import { routes } from '@/shared/lib/routes';

import type { Product, ProductCategory } from '../types';

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
    description: 'ТВ-панели, открытые полки и хранение вокруг зоны отдыха.',
    href: `${routes.works}?category=tv-zones`,
    id: 'tv-zones',
    title: 'ТВ-зоны',
  },
];

export function getVisibleProductCategories(projects: Product[]) {
  return productCategories.filter((category) => getCategoryProject(projects, category));
}

export function getCategoryProject(projects: Product[], category: ProductCategory) {
  return projects.find((project) => hasProjectImage(project) && matchesCategory(project, category));
}

function hasProjectImage(project: Product) {
  return Boolean(
    project.imageUrl &&
    project.imageUrl !== '/images/logo.jpg' &&
    project.media?.some((media) => media.kind === 'image'),
  );
}

function matchesCategory(project: Product, category: ProductCategory) {
  const value = `${project.category} ${project.name} ${project.description}`.toLocaleLowerCase(
    'ru-RU',
  );

  if (category.id === 'kitchens') {
    return value.includes('кух');
  }

  if (category.id === 'wardrobes') {
    return value.includes('шкаф');
  }

  if (category.id === 'tv-zones') {
    return value.includes('тв') || value.includes('tv') || value.includes('телевиз');
  }

  return value === category.title.toLocaleLowerCase('ru-RU');
}
