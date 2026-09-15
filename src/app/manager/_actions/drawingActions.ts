'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { workshopApi } from '@/entities/workshop';
import { routes } from '@/shared/lib/routes';

import type { ManagerFormState } from './formState';
import { getApiErrorMessage, readPositiveInteger } from './helpers';

export async function uploadDrawingAction(
  _state: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  const orderId = readPositiveInteger(formData, 'order_id');
  const file = formData.get('file');
  const errors: Record<string, string> = {};

  if (orderId === null) {
    errors.order_id = 'Выберите заказ.';
  }

  if (!(file instanceof File) || file.size === 0) {
    errors.file = 'Выберите файл чертежа.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, message: 'Проверьте поля загрузки.' };
  }

  try {
    await workshopApi.uploadDrawing({
      file: file as File,
      order_id: orderId ?? 0,
    });
  } catch (error) {
    return { message: getApiErrorMessage(error) };
  }

  revalidatePath(routes.manager);
  revalidatePath(routes.managerDrawings);
  redirect(routes.managerDrawings);
}
