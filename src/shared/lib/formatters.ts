export function formatPrice(value: number) {
  return new Intl.NumberFormat('ru-KZ', {
    currency: 'KZT',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

export function formatMoney(value: null | number | string | undefined) {
  if (value === null || value === undefined || value === '') {
    return 'требует проверки';
  }

  const amount = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(amount)) {
    return 'требует проверки';
  }

  return formatPrice(amount);
}

export function formatDateTime(value: null | string | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
