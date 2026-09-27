'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { productApi } from '@/entities/product/api';
import type { ProductPayload } from '@/entities/product/types';
import { routes } from '@/shared/lib/routes';

import type { ManagerFormState } from './formState';
import { getApiErrorMessage, readText } from './helpers';

export async function createProductAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const payload = readProductPayload(formData);

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля товара.' };
  }

  try {
    await productApi.create(payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidateProductPages();
  redirect(routes.managerProducts);
}

export async function deleteProductAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = Number(readText(formData, 'id'));

  if (!Number.isInteger(id) || id <= 0) {
    return { message: 'Не удалось определить товар для удаления.' };
  }

  try {
    await productApi.delete(id);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidateProductPages();
  redirect(routes.managerProducts);
}

function readProductPayload(formData: FormData): {
  data: ProductPayload;
  errors: Record<string, string>;
} {
  const name = readText(formData, 'name');
  const category = readText(formData, 'category');
  const price = readPositiveMoney(formData, 'price');
  const oldPrice = readOptionalMoney(formData, 'oldPrice');
  const slug = readText(formData, 'slug') || createProductSlug(name);
  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = 'Укажите название товара.';
  }

  if (!category) {
    errors.category = 'Выберите категорию.';
  }

  if (price === null) {
    errors.price = 'Цена должна быть числом больше нуля.';
  }

  if (!isValidSlug(slug)) {
    errors.slug = 'Slug должен содержать только латинские буквы, цифры и дефисы.';
  }

  const data: ProductPayload = {
    badge: readText(formData, 'badge') || undefined,
    category,
    description: readText(formData, 'description'),
    dimensions: readText(formData, 'dimensions'),
    imagePosition: readText(formData, 'imagePosition') || '50% 50%',
    imageUrl: readText(formData, 'imageUrl') || '/images/hero-interior.png',
    isAvailable: readText(formData, 'isAvailable') !== 'false',
    materials: readText(formData, 'materials'),
    name,
    oldPrice: oldPrice ?? undefined,
    price: price ?? 0,
    slug,
    term: readText(formData, 'term'),
  };

  validateRequiredText(data.description, 'description', 'Укажите описание товара.', errors);
  validateRequiredText(data.materials, 'materials', 'Укажите материалы.', errors);
  validateRequiredText(data.term, 'term', 'Укажите срок изготовления.', errors);
  validateRequiredText(data.dimensions, 'dimensions', 'Укажите размеры.', errors);

  return { data, errors };
}

function readPositiveMoney(formData: FormData, key: string) {
  const value = readOptionalMoney(formData, key);

  return value !== null && value > 0 ? value : null;
}

function readOptionalMoney(formData: FormData, key: string) {
  const rawValue = readText(formData, key);

  if (!rawValue) {
    return null;
  }

  const value = Number(rawValue.replace(/\s/g, '').replace(',', '.'));

  return Number.isFinite(value) ? value : null;
}

function createProductSlug(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || `product-${Date.now()}`;
}

function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function validateRequiredText(
  value: string,
  key: string,
  message: string,
  errors: Record<string, string>,
) {
  if (!value) {
    errors[key] = message;
  }
}

function revalidateProductPages() {
  revalidatePath(routes.home);
  revalidatePath(routes.catalog);
  revalidatePath(routes.managerProducts);
}
