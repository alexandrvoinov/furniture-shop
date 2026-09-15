'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { FormEvent } from 'react';

import { addManagerProduct, type Product, type ProductCategory } from '@/entities/product';
import { routes } from '@/shared/lib/routes';
import { showToast } from '@/shared/ui/toast';

import styles from '../../ManagerPage.module.scss';

type ProductFormProps = {
  categories: ProductCategory[];
};

const defaultImageUrl = '/images/hero-interior.png';

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const name = getRequiredValue(formData, 'name');
      const category = getRequiredValue(formData, 'category');
      const price = getPositiveNumber(formData, 'price');
      const product: Product = {
        badge: getOptionalValue(formData, 'badge'),
        category,
        description: getRequiredValue(formData, 'description'),
        dimensions: getRequiredValue(formData, 'dimensions'),
        id: createProductId(),
        imagePosition: getOptionalValue(formData, 'imagePosition') || '50% 50%',
        imageUrl: getOptionalValue(formData, 'imageUrl') || defaultImageUrl,
        isAvailable: formData.get('isAvailable') !== 'false',
        materials: getRequiredValue(formData, 'materials'),
        name,
        oldPrice: getOptionalNumber(formData, 'oldPrice'),
        price,
        slug: getOptionalValue(formData, 'slug') || createProductSlug(name),
        term: getRequiredValue(formData, 'term'),
      };

      addManagerProduct(product);
      showToast({
        message: `Товар ${product.name} добавлен в панель`,
        title: 'Товары',
        variant: 'success',
      });
      router.push(routes.managerProducts);
    } catch (error) {
      showToast({
        message: getErrorMessage(error),
        title: 'Не удалось добавить товар',
        variant: 'error',
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          <span>Название</span>
          <input name="name" placeholder="Кухня Alba" required />
        </label>

        <label className={styles.field}>
          <span>Категория</span>
          <select name="category" required>
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Цена, ₸</span>
          <input inputMode="decimal" name="price" placeholder="590000" required />
        </label>

        <label className={styles.field}>
          <span>Старая цена, ₸</span>
          <input inputMode="decimal" name="oldPrice" placeholder="680000" />
        </label>

        <label className={styles.field}>
          <span>Материалы</span>
          <input name="materials" placeholder="МДФ эмаль, шпон дуба, кварц" required />
        </label>

        <label className={styles.field}>
          <span>Срок изготовления</span>
          <input name="term" placeholder="45 дней" required />
        </label>

        <label className={styles.field}>
          <span>Размеры</span>
          <input name="dimensions" placeholder="от 8 м²" required />
        </label>

        <label className={styles.field}>
          <span>Статус</span>
          <select defaultValue="true" name="isAvailable">
            <option value="true">Доступен</option>
            <option value="false">Скрыт</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Бейдж</span>
          <input name="badge" placeholder="Хит, На заказ, Новинка" />
        </label>

        <label className={styles.field}>
          <span>Slug</span>
          <input name="slug" placeholder="kitchen-alba" />
          <span className={styles.fieldHint}>
            Можно оставить пустым, значение создастся автоматически.
          </span>
        </label>

        <label className={styles.field}>
          <span>Изображение</span>
          <input name="imageUrl" placeholder={defaultImageUrl} />
        </label>

        <label className={styles.field}>
          <span>Позиция изображения</span>
          <input name="imagePosition" placeholder="50% 50%" />
        </label>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Описание</span>
          <textarea
            name="description"
            placeholder="Коротко опишите товар, сценарий использования и особенности."
            required
          />
        </label>
      </div>

      <div className={styles.formActions}>
        <button type="submit">Сохранить товар</button>
        <Link className={styles.secondaryLink} href={routes.managerProducts}>
          Отмена
        </Link>
      </div>
    </form>
  );
}

function getRequiredValue(formData: FormData, key: string) {
  const value = getOptionalValue(formData, key);

  if (!value) {
    throw new Error('Заполните обязательные поля товара.');
  }

  return value;
}

function getOptionalValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function getPositiveNumber(formData: FormData, key: string) {
  const rawValue = getRequiredValue(formData, key);
  const value = parseNumberInput(rawValue);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Цена должна быть больше нуля.');
  }

  return value;
}

function getOptionalNumber(formData: FormData, key: string) {
  const rawValue = getOptionalValue(formData, key);

  if (!rawValue) {
    return undefined;
  }

  const value = parseNumberInput(rawValue);

  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function parseNumberInput(value: string) {
  const normalizedValue = value.replace(/\s/g, '').replace(',', '.');

  return Number(normalizedValue);
}

function createProductId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `manual-${crypto.randomUUID()}`;
  }

  return `manual-${Date.now()}`;
}

function createProductSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || `manual-${Date.now()}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Попробуйте заполнить форму еще раз.';
}
