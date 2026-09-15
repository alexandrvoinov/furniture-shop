import { ApiError } from '@/shared/api';

export function readText(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

export function readPositiveInteger(formData: FormData, key: string) {
  const value = Number(readText(formData, key));

  return Number.isInteger(value) && value > 0 ? value : null;
}

export function readMoney(formData: FormData, key: string) {
  const normalized = readText(formData, key).replace(',', '.');
  const value = Number(normalized);

  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const details = error.details;

    if (isErrorDetails(details)) {
      return details.error.message;
    }

    return `Backend вернул ошибку ${error.status}`;
  }

  return 'Не удалось сохранить данные. Проверьте backend и попробуйте еще раз.';
}

function isErrorDetails(value: unknown): value is { error: { message: string } } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'message' in value.error &&
    typeof value.error.message === 'string'
  );
}
