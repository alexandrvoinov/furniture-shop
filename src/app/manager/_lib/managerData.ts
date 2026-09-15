import type { DashboardResponse, ListResponse } from '@/entities/workshop';

export type ManagerSearchParams = Record<string, string | string[] | undefined>;
type PaginationQuery = {
  limit: number;
  offset: number;
};

export const defaultDashboard: DashboardResponse = {
  clients_count: 0,
  financials: {
    outstanding_amount: '0.00',
    overpaid_amount: '0.00',
    paid_amount: '0.00',
    pending_amount: '0.00',
    review_orders_count: 0,
    total_order_amount: '0.00',
  },
  orders_by_status: [],
  orders_count: 0,
};

export function emptyList<TItem>(): ListResponse<TItem> {
  return {
    items: [],
    total: 0,
  };
}

export function getParam(params: ManagerSearchParams, key: string) {
  const value = params[key];

  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export function getPositiveNumberParam(params: ManagerSearchParams, key: string) {
  const value = Number(getParam(params, key));

  return Number.isInteger(value) && value > 0 ? value : undefined;
}

export function pickResult<TValue>(
  result: PromiseSettledResult<TValue>,
  fallback: TValue,
  label: string,
  errors: string[],
) {
  if (result.status === 'fulfilled') {
    return result.value;
  }

  errors.push(label);
  return fallback;
}

export async function loadAllPages<TItem>(
  loader: (pagination: PaginationQuery) => Promise<ListResponse<TItem>>,
  { maxItems = 1000, pageSize = 100 }: { maxItems?: number; pageSize?: number } = {},
) {
  const items: TItem[] = [];
  let offset = 0;
  let total = 0;

  while (items.length < maxItems) {
    const page = await loader({
      limit: Math.min(pageSize, maxItems - items.length),
      offset,
    });

    total = page.total;
    items.push(...page.items);

    if (page.items.length === 0 || items.length >= total) {
      break;
    }

    offset += page.items.length;
  }

  return {
    items,
    total,
  };
}

export function toVisibleList<TItem>(items: TItem[], limit = 20): ListResponse<TItem> {
  return {
    items: items.slice(0, limit),
    total: items.length,
  };
}

export function normalizeDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function normalizeSearch(value: number | string | null | undefined) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('ru-RU');
}
