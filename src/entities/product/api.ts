import { siteContentApi, type SiteMedia, type SiteProject } from '@/entities/site-content';

import type { Product, ProductFilters } from './types';

export type ProductWithMeta = Product;

export const productApi = {
  async getBySlug(slug: string) {
    const products = await loadProducts();
    const product = products.find((item) => item.slug === slug);

    if (!product) {
      throw new Error(`Project ${slug} not found`);
    }

    return product;
  },

  async list(filters?: ProductFilters) {
    const products = await loadProducts();
    const filteredProducts = filters?.category
      ? products.filter((product) => product.category === filters.category)
      : products;
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? filteredProducts.length;

    return filteredProducts.slice(offset, offset + limit);
  },
};

async function loadProducts(): Promise<Product[]> {
  const content = await siteContentApi.get();

  return content.projects.map(fromSiteProject);
}

function fromSiteProject(project: SiteProject, index: number): Product {
  const imageMedia = firstMedia(project.media, 'image');
  const category = project.furniture_type || guessCategory(project.title, project.description);

  return {
    category,
    description: project.description || 'Проект мебели на заказ с фото из портфолио VEEMA.',
    dimensions: project.dimensions || 'По замеру',
    id: String(project.id ?? index + 1),
    imageUrl: imageMedia?.url ?? '/images/logo.jpg',
    isAvailable: true,
    materials: project.material || 'По проекту',
    media: project.media ?? [],
    name: project.title,
    price: toNumber(project.approximate_price),
    slug: slugify(project.title, index),
    term: project.production_time || 'После согласования',
  };
}

function firstMedia(media: SiteMedia[] | undefined, kind: SiteMedia['kind']) {
  return media?.find((item) => item.kind === kind);
}

function guessCategory(title: string, description = '') {
  const text = `${title} ${description}`.toLocaleLowerCase('ru-RU');

  if (text.includes('кух')) {
    return 'Кухни';
  }

  if (text.includes('гардероб')) {
    return 'Гардеробные';
  }

  if (text.includes('шкаф') || text.includes('хранен')) {
    return 'Шкафы';
  }

  return 'Встроенная мебель';
}

function slugify(value: string, index: number) {
  const slug = transliterate(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug ? `${slug}-${index + 1}` : `project-${index + 1}`;
}

function transliterate(value: string) {
  const letters: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sch',
    ы: 'y',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };

  return value
    .toLowerCase()
    .replace(/[ъь]/g, '')
    .replace(/[а-яё]/g, (letter) => letters[letter] ?? letter);
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }

  const numberValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : undefined;
}
