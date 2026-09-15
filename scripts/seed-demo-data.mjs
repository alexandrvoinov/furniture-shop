import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = loadEnvLocal();
const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL ?? env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000',
);
const DEMO_CURRENCY = 'KZT';

const demoClients = [
  {
    name: 'Анна Морозова',
    phone: '+7 900 101-10-10',
  },
  {
    name: 'Дмитрий Волков',
    phone: '+7 900 202-20-20',
  },
  {
    name: 'Мария Соколова',
    phone: '+7 900 303-30-30',
  },
];

const demoOrders = [
  {
    clientPhone: '+7 900 101-10-10',
    color: 'Молочный матовый',
    material: 'МДФ эмаль',
    price: 1450000,
    product_name: 'Демо кухня Alba',
    quantity: 1,
    statusIndex: 1,
  },
  {
    clientPhone: '+7 900 202-20-20',
    color: 'Орех натуральный',
    material: 'Шпон',
    price: 980000,
    product_name: 'Демо шкаф Linea',
    quantity: 1,
    statusIndex: 0,
  },
  {
    clientPhone: '+7 900 303-30-30',
    color: 'Графит',
    material: 'ЛДСП Egger',
    price: 1250000,
    product_name: 'Демо гардеробная Forma',
    quantity: 1,
    statusIndex: 2,
  },
  {
    clientPhone: '+7 900 101-10-10',
    color: 'Белый шелк',
    material: 'МДФ пленка',
    price: 620000,
    product_name: 'Демо тумба для спальни',
    quantity: 2,
    statusIndex: 3,
  },
];

const demoPayments = [
  {
    amount: 500000,
    orderName: 'Демо кухня Alba',
    statusIndex: 1,
  },
  {
    amount: 250000,
    orderName: 'Демо кухня Alba',
    statusIndex: 0,
  },
  {
    amount: 980000,
    orderName: 'Демо шкаф Linea',
    statusIndex: 1,
  },
  {
    amount: 400000,
    orderName: 'Демо гардеробная Forma',
    statusIndex: 0,
  },
];

const legacyDemoPaymentAmounts = new Set(['70000.00', '100000.00', '150000.00', '280000.00']);
const demoDrawingOrderNames = ['Демо кухня Alba', 'Демо шкаф Linea', 'Демо гардеробная Forma'];

const counters = {
  created: 0,
  reused: 0,
  updated: 0,
};

async function main() {
  const metadata = await request('/metadata');
  const orderStatuses = metadata.order_statuses ?? [];
  const paymentStatuses = metadata.payment_statuses ?? [];

  if (orderStatuses.length === 0 || paymentStatuses.length === 0) {
    throw new Error('Backend metadata returned empty statuses.');
  }

  console.log(`Seeding ${DEMO_CURRENCY} demo data through ${API_BASE_URL}`);

  const clientsByPhone = new Map();
  for (const client of demoClients) {
    const saved = await ensureClient(client);
    clientsByPhone.set(client.phone, saved);
  }

  const ordersByName = new Map();
  for (const order of demoOrders) {
    const client = clientsByPhone.get(order.clientPhone);
    const status = pickStatus(orderStatuses, order.statusIndex);
    const saved = await ensureOrder({
      client_id: client.id,
      color: order.color,
      material: order.material,
      price: order.price,
      product_name: order.product_name,
      quantity: order.quantity,
      status,
    });
    ordersByName.set(order.product_name, saved);
  }

  for (const payment of demoPayments) {
    const order = ordersByName.get(payment.orderName);
    await ensurePayment({
      amount: payment.amount,
      order_id: order.id,
      status: pickStatus(paymentStatuses, payment.statusIndex),
    });
  }

  await removeLegacyDemoPayments(ordersByName);

  for (const orderName of demoDrawingOrderNames) {
    const order = ordersByName.get(orderName);
    await ensureDrawing(order.id, slugify(orderName));
  }

  const dashboard = await request('/dashboard/');
  console.log('');
  console.log('Demo seed completed.');
  console.log(
    `Created: ${counters.created}, reused: ${counters.reused}, updated: ${counters.updated}`,
  );
  console.log(`Dashboard: ${dashboard.clients_count} clients, ${dashboard.orders_count} orders`);
}

async function ensureClient(payload) {
  const clients = await request('/clients/', {
    query: {
      limit: 100,
      offset: 0,
      q: payload.phone,
    },
  });
  const existing = clients.find((client) => client.phone === payload.phone);

  if (existing) {
    counters.reused += 1;
    return existing;
  }

  counters.created += 1;
  return request('/clients/', {
    body: payload,
    method: 'POST',
  });
}

async function ensureOrder(payload) {
  const orders = await request('/orders/', {
    query: {
      client_id: payload.client_id,
      limit: 100,
      offset: 0,
      q: payload.product_name,
    },
  });
  const existing = orders.find(
    (order) => order.client_id === payload.client_id && order.product_name === payload.product_name,
  );

  if (!existing) {
    counters.created += 1;
    const created = await request('/orders/', {
      body: {
        client_id: payload.client_id,
        color: payload.color,
        material: payload.material,
        price: payload.price,
        product_name: payload.product_name,
        quantity: payload.quantity,
      },
      method: 'POST',
    });

    if (created.status !== payload.status) {
      return updateOrder(created.id, payload);
    }

    return created;
  }

  if (shouldUpdateOrder(existing, payload)) {
    return updateOrder(existing.id, payload);
  }

  counters.reused += 1;
  return existing;
}

async function updateOrder(id, payload) {
  counters.updated += 1;
  return request(`/orders/${id}`, {
    body: {
      color: payload.color,
      material: payload.material,
      price: payload.price,
      product_name: payload.product_name,
      quantity: payload.quantity,
      status: payload.status,
    },
    method: 'PUT',
  });
}

async function ensurePayment(payload) {
  const payments = await request('/payments/', {
    query: {
      limit: 100,
      offset: 0,
      order_id: payload.order_id,
    },
  });
  const existing = payments.find(
    (payment) => sameMoney(payment.amount, payload.amount) && payment.status === payload.status,
  );

  if (existing) {
    counters.reused += 1;
    return existing;
  }

  counters.created += 1;
  return request('/payments/', {
    body: payload,
    method: 'POST',
  });
}

async function removeLegacyDemoPayments(ordersByName) {
  const demoOrderIds = new Set([...ordersByName.values()].map((order) => order.id));

  for (const orderId of demoOrderIds) {
    const payments = await request('/payments/', {
      query: {
        limit: 100,
        offset: 0,
        order_id: orderId,
      },
    });

    for (const payment of payments) {
      if (legacyDemoPaymentAmounts.has(Number(payment.amount).toFixed(2))) {
        await request(`/payments/${payment.id}`, {
          method: 'DELETE',
        });
        counters.updated += 1;
      }
    }
  }
}

async function ensureDrawing(orderId, slug) {
  const drawings = await request('/drawings/', {
    query: {
      limit: 100,
      offset: 0,
      order_id: orderId,
    },
  });
  const existing = drawings.find((drawing) => drawing.file_url.startsWith('/drawings/files/'));

  if (existing) {
    counters.reused += 1;
    return existing;
  }

  const formData = new FormData();
  formData.append('order_id', String(orderId));
  formData.append('file', createDemoPdf(slug), `${slug}.pdf`);

  counters.created += 1;
  return request('/drawings/upload', {
    body: formData,
    method: 'POST',
  });
}

async function request(endpoint, options = {}) {
  const url = buildUrl(endpoint, options.query);
  const headers = new Headers(options.headers);
  const init = {
    method: options.method ?? 'GET',
    headers,
  };

  if (options.body instanceof FormData) {
    init.body = options.body;
  } else if (options.body) {
    headers.set('Content-Type', 'application/json');
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, init);
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    throw new Error(`API ${init.method} ${url.pathname} failed with ${response.status}: ${text}`);
  }

  return data;
}

function buildUrl(endpoint, query) {
  const url = new URL(endpoint.replace(/^\//, ''), `${API_BASE_URL}/`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url;
}

function shouldUpdateOrder(existing, payload) {
  return (
    existing.color !== payload.color ||
    existing.material !== payload.material ||
    !sameMoney(existing.price, payload.price) ||
    existing.quantity !== payload.quantity ||
    existing.status !== payload.status
  );
}

function sameMoney(left, right) {
  return Number(left).toFixed(2) === Number(right).toFixed(2);
}

function pickStatus(statuses, index) {
  return statuses[Math.min(index, statuses.length - 1)] ?? statuses[0];
}

function createDemoPdf(slug) {
  const pdf = [
    '%PDF-1.4',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 300 180] /Contents 4 0 R >> endobj',
    `4 0 obj << /Length 58 >> stream BT /F1 16 Tf 32 110 Td (${slug}) Tj ET endstream endobj`,
    'trailer << /Root 1 0 R >>',
    '%%EOF',
  ].join('\n');

  return new Blob([pdf], { type: 'application/pdf' });
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function loadEnvLocal() {
  try {
    const content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');

    return Object.fromEntries(
      content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const [key, ...parts] = line.split('=');
          return [key, parts.join('=').replace(/^["']|["']$/g, '')];
        }),
    );
  } catch {
    return {};
  }
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
