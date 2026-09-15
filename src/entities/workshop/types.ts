export type ListQuery = {
  limit?: number;
  offset?: number;
  q?: string;
};

export type ListResponse<TItem> = {
  items: TItem[];
  total: number;
};

export type MetadataResponse = {
  order_statuses: string[];
  payment_states: string[];
  payment_statuses: string[];
};

export type OrderFinancials = {
  balance_amount: null | string;
  cancelled_amount: string;
  needs_review: boolean;
  overpaid_amount: null | string;
  paid_amount: string;
  payment_status: string;
  pending_amount: string;
  total_amount: string;
  unclassified_payments_count: number;
};

export type DashboardFinancials = {
  outstanding_amount: null | string;
  overpaid_amount: null | string;
  paid_amount: string;
  pending_amount: string;
  review_orders_count: number;
  total_order_amount: string;
};

export type DashboardResponse = {
  clients_count: number;
  financials: DashboardFinancials;
  orders_by_status: Array<{
    count: number;
    status: null | string;
  }>;
  orders_count: number;
};

export type Client = {
  created_at: null | string;
  id: number;
  name: string;
  phone: string;
};

export type ClientPayload = {
  name: string;
  phone: string;
};

export type ClientFull = Client & {
  orders: Order[];
};

export type Order = {
  client_id: number;
  color: string;
  created_at: null | string;
  financials: OrderFinancials;
  id: number;
  material: string;
  price: number;
  product_name: string;
  quantity: number;
  status: string;
};

export type OrderFull = Order & {
  drawings: Drawing[];
  payments: Payment[];
};

export type OrdersQuery = ListQuery & {
  client_id?: number;
  material?: string;
  sort_by?: 'created_at' | 'id' | 'price' | 'product_name' | 'status';
  sort_order?: 'asc' | 'desc';
  status?: string;
};

export type OrderCreatePayload = {
  client_id: number;
  color: string;
  material: string;
  price: number;
  product_name: string;
  quantity: number;
};

export type OrderUpdatePayload = Omit<OrderCreatePayload, 'client_id'> & {
  status: string;
};

export type Payment = {
  amount: number;
  id: number;
  order_id: number;
  payment_date: null | string;
  status: null | string;
};

export type PaymentCreatePayload = {
  amount: number;
  order_id: number;
  status: string;
};

export type PaymentUpdatePayload = {
  amount: number;
  status: string;
};

export type Drawing = {
  created_at: null | string;
  file_url: string;
  id: number;
  order_id: number;
};
