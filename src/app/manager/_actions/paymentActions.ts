'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { workshopApi } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import type { ManagerFormState } from './formState';
import { getApiErrorMessage, readMoney, readPositiveInteger, readText } from './helpers';

export async function createPaymentAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const payload = readPaymentCreatePayload(formData);

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля оплаты.' };
  }

  try {
    await workshopApi.createPayment(payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerOrders);
  revalidatePath(routes.managerPayments);
  redirect(routes.managerPayments);
}

export async function updatePaymentAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = Number(readText(formData, 'id'));
  const payload = readPaymentUpdatePayload(formData);

  if (!Number.isInteger(id) || id <= 0) {
    return { message: 'Не удалось определить оплату для обновления.' };
  }

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля оплаты.' };
  }

  try {
    await workshopApi.updatePayment(id, payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerOrders);
  revalidatePath(routes.managerPayments);
  redirect(routes.managerPayments);
}

function readPaymentCreatePayload(formData: FormData) {
  const orderId = readPositiveInteger(formData, 'order_id');
  const common = readPaymentCommonPayload(formData);
  const errors = { ...common.errors };

  if (orderId === null) {
    errors.order_id = 'Выберите заказ.';
  }

  return {
    data: {
      ...common.data,
      order_id: orderId ?? 0,
    },
    errors,
  };
}

function readPaymentUpdatePayload(formData: FormData) {
  return readPaymentCommonPayload(formData);
}

function readPaymentCommonPayload(formData: FormData) {
  const amount = readMoney(formData, 'amount');
  const status = readText(formData, 'status');
  const errors: Record<string, string> = {};

  if (amount === null || amount <= 0) {
    errors.amount = 'Сумма должна быть больше 0.';
  }

  if (!status) {
    errors.status = 'Выберите статус оплаты.';
  }

  return {
    data: {
      amount: amount ?? 0,
      status,
    },
    errors,
  };
}
