import { apiRequest, apiRequestWithMeta } from '@/shared/api';

import type {
  Client,
  ClientFull,
  ClientPayload,
  DashboardResponse,
  Drawing,
  ListQuery,
  ListResponse,
  MetadataResponse,
  Order,
  OrderCreatePayload,
  OrderFull,
  OrdersQuery,
  OrderUpdatePayload,
  Payment,
  PaymentCreatePayload,
  PaymentUpdatePayload,
} from './types';

export const workshopApi = {
  getDashboard() {
    return apiRequest<DashboardResponse>('/dashboard/', {
      cache: 'no-store',
    });
  },

  getMetadata() {
    return apiRequest<MetadataResponse>('/metadata', {
      cache: 'no-store',
    });
  },

  createClient(payload: ClientPayload) {
    return apiRequest<Client>('/clients/', {
      body: payload,
      method: 'POST',
    });
  },

  getClient(id: number) {
    return apiRequest<ClientFull>(`/clients/${id}`, {
      cache: 'no-store',
    });
  },

  listClients(query?: ListQuery) {
    return listResource<Client>('/clients/', query);
  },

  updateClient(id: number, payload: ClientPayload) {
    return apiRequest<Client>(`/clients/${id}`, {
      body: payload,
      method: 'PUT',
    });
  },

  deleteClient(id: number) {
    return apiRequest<Client>(`/clients/${id}`, {
      method: 'DELETE',
    });
  },

  listDrawings(query?: ListQuery & { order_id?: number }) {
    return listResource<Drawing>('/drawings/', query);
  },

  deleteDrawing(id: number) {
    return apiRequest<Drawing>(`/drawings/${id}`, {
      method: 'DELETE',
    });
  },

  createOrder(payload: OrderCreatePayload) {
    return apiRequest<Order>('/orders/', {
      body: payload,
      method: 'POST',
    });
  },

  getOrder(id: number) {
    return apiRequest<OrderFull>(`/orders/${id}`, {
      cache: 'no-store',
    });
  },

  listOrders(query?: OrdersQuery) {
    return listResource<Order>('/orders/', query);
  },

  updateOrder(id: number, payload: OrderUpdatePayload) {
    return apiRequest<Order>(`/orders/${id}`, {
      body: payload,
      method: 'PUT',
    });
  },

  deleteOrder(id: number) {
    return apiRequest<Order>(`/orders/${id}`, {
      method: 'DELETE',
    });
  },

  listPayments(query?: ListQuery & { order_id?: number }) {
    return listResource<Payment>('/payments/', query);
  },

  createPayment(payload: PaymentCreatePayload) {
    return apiRequest<Payment>('/payments/', {
      body: payload,
      method: 'POST',
    });
  },

  getPayment(id: number) {
    return apiRequest<Payment>(`/payments/${id}`, {
      cache: 'no-store',
    });
  },

  updatePayment(id: number, payload: PaymentUpdatePayload) {
    return apiRequest<Payment>(`/payments/${id}`, {
      body: payload,
      method: 'PUT',
    });
  },

  deletePayment(id: number) {
    return apiRequest<Payment>(`/payments/${id}`, {
      method: 'DELETE',
    });
  },

  uploadDrawing(payload: { file: File; order_id: number }) {
    const formData = new FormData();
    formData.append('order_id', String(payload.order_id));
    formData.append('file', payload.file);

    return apiRequest<Drawing>('/drawings/upload', {
      body: formData,
      method: 'POST',
    });
  },
};

async function listResource<TItem>(
  endpoint: string,
  query?: Record<string, boolean | null | number | string | undefined>,
): Promise<ListResponse<TItem>> {
  const { data, headers } = await apiRequestWithMeta<TItem[]>(endpoint, {
    cache: 'no-store',
    query,
  });

  return {
    items: data,
    total: Number(headers.get('X-Total-Count') ?? data.length),
  };
}
