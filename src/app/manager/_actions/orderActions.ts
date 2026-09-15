'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { workshopApi } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import type { ManagerFormState } from './formState';
import { getApiErrorMessage, readMoney, readPositiveInteger, readText } from './helpers';

export async function createOrderAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const payload = readOrderCreatePayload(formData);

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля заказа.' };
  }

  try {
    await workshopApi.createOrder(payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerOrders);
  redirect(routes.managerOrders);
}

export async function updateOrderAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = Number(readText(formData, 'id'));
  const payload = readOrderUpdatePayload(formData);

  if (!Number.isInteger(id) || id <= 0) {
    return { message: 'Не удалось определить заказ для обновления.' };
  }

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля заказа.' };
  }

  try {
    await workshopApi.updateOrder(id, payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerOrders);
  redirect(routes.managerOrders);
}

function readOrderCreatePayload(formData: FormData) {
  const clientId = readPositiveInteger(formData, 'client_id');
  const common = readOrderCommonPayload(formData);
  const errors = { ...common.errors };

  if (clientId === null) {
    errors.client_id = 'Выберите клиента.';
  }

  return {
    data: {
      ...common.data,
      client_id: clientId ?? 0,
    },
    errors,
  };
}

function readOrderUpdatePayload(formData: FormData) {
  const common = readOrderCommonPayload(formData);
  const status = readText(formData, 'status');
  const errors = { ...common.errors };

  if (!status) {
    errors.status = 'Выберите статус заказа.';
  }

  return {
    data: {
      ...common.data,
      status,
    },
    errors,
  };
}

function readOrderCommonPayload(formData: FormData) {
  const productName = readText(formData, 'product_name');
  const material = readText(formData, 'material');
  const color = readText(formData, 'color');
  const quantity = readPositiveInteger(formData, 'quantity');
  const price = readMoney(formData, 'price');
  const errors: Record<string, string> = {};

  if (!productName) {
    errors.product_name = 'Укажите изделие.';
  }

  if (!material) {
    errors.material = 'Укажите материал.';
  }

  if (!color) {
    errors.color = 'Укажите цвет.';
  }

  if (quantity === null) {
    errors.quantity = 'Количество должно быть положительным целым числом.';
  }

  if (price === null) {
    errors.price = 'Стоимость должна быть числом от 0.';
  }

  return {
    data: {
      color,
      material,
      price: price ?? 0,
      product_name: productName,
      quantity: quantity ?? 1,
    },
    errors,
  };
}
