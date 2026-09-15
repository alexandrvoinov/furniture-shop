'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { workshopApi } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import type { ManagerFormState } from './formState';
import { getApiErrorMessage, readText } from './helpers';

export async function createClientAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const payload = readClientPayload(formData);

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля клиента.' };
  }

  try {
    await workshopApi.createClient(payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerClients);
  redirect(routes.managerClients);
}

export async function updateClientAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const id = Number(readText(formData, 'id'));
  const payload = readClientPayload(formData);

  if (!Number.isInteger(id) || id <= 0) {
    return { message: 'Не удалось определить клиента для обновления.' };
  }

  if (Object.keys(payload.errors).length > 0) {
    return { errors: payload.errors, message: 'Проверьте поля клиента.' };
  }

  try {
    await workshopApi.updateClient(id, payload.data);
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerClients);
  redirect(routes.managerClients);
}

function readClientPayload(formData: FormData) {
  const name = readText(formData, 'name');
  const phone = readText(formData, 'phone');
  const errors: Record<string, string> = {};

  if (!name) {
    errors.name = 'Укажите имя клиента.';
  }

  if (!phone) {
    errors.phone = 'Укажите телефон клиента.';
  }

  return {
    data: { name, phone },
    errors,
  };
}
