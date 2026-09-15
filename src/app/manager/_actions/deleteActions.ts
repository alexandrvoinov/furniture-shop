'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { workshopApi } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import type { ManagerFormState } from './formState';
import { getApiErrorMessage, readPositiveInteger, readText } from './helpers';

export async function deleteClientAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = readRequiredId(formData);

  if (id === null) {
    return { message: 'Не удалось определить клиента для удаления.' };
  }

  try {
    await workshopApi.deleteClient(id);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerClients);
  revalidatePath(routes.managerOrders);
  redirect(routes.managerClients);
}

export async function deleteOrderAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = readRequiredId(formData);

  if (id === null) {
    return { message: 'Не удалось определить заказ для удаления.' };
  }

  try {
    await workshopApi.deleteOrder(id);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerOrders);
  revalidatePath(routes.managerPayments);
  revalidatePath(routes.managerDrawings);
  redirect(routes.managerOrders);
}

export async function deletePaymentAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = readRequiredId(formData);

  if (id === null) {
    return { message: 'Не удалось определить оплату для удаления.' };
  }

  try {
    await workshopApi.deletePayment(id);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerOrders);
  revalidatePath(routes.managerPayments);
  redirect(readReturnTo(formData) ?? routes.managerPayments);
}

export async function deleteDrawingAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = readRequiredId(formData);

  if (id === null) {
    return { message: 'Не удалось определить чертеж для удаления.' };
  }

  try {
    await workshopApi.deleteDrawing(id);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerDrawings);
  redirect(readReturnTo(formData) ?? routes.managerDrawings);
}

function readRequiredId(formData: FormData) {
  return readPositiveInteger(formData, 'id');
}

function readReturnTo(formData: FormData) {
  const value = readText(formData, 'return_to');

  return value.startsWith('/manager') ? value : null;
}
