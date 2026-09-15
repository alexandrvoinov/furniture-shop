import { notFound } from 'next/navigation';

import { workshopApi, type Client, type MetadataResponse } from '@/entities/workshop';

import { updateOrderAction } from '../../../_actions/orderActions';
import { OrderForm } from '../../../_components/OrderForm';
import { ApiNotice, PageTitle, PanelTitle } from '../../../_components/ManagerUi';
import { emptyList, pickResult } from '../../../_lib/managerData';
import styles from '../../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type EditOrderPageProps = {
  params: Promise<{ id: string }>;
};

const emptyMetadata: MetadataResponse = {
  order_statuses: [],
  payment_states: [],
  payment_statuses: [],
};

export default async function EditOrderPage({ params }: EditOrderPageProps) {
  const orderId = Number((await params).id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    notFound();
  }

  const order = await getOrderOrNotFound(orderId);
  const results = await Promise.allSettled([
    workshopApi.getMetadata(),
    workshopApi.listClients({ limit: 100, offset: 0 }),
  ]);
  const errors: string[] = [];
  const metadata = pickResult(results[0], emptyMetadata, 'metadata', errors);
  const clients = pickResult(results[1], emptyList<Client>(), 'clients', errors);
  const statuses = metadata.order_statuses.includes(order.status)
    ? metadata.order_statuses
    : [order.status, ...metadata.order_statuses];

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Редактирование" title={`Заказ #${order.id}`} />
      <ApiNotice errors={errors} />

      <section className={styles.panel}>
        <PanelTitle eyebrow="Карточка" title="Данные заказа" />
        <OrderForm
          action={updateOrderAction}
          clients={clients.items}
          defaultValues={{
            client_id: order.client_id,
            color: order.color,
            id: order.id,
            material: order.material,
            price: order.price,
            product_name: order.product_name,
            quantity: order.quantity,
            status: order.status,
          }}
          mode="edit"
          statuses={statuses}
          submitLabel="Сохранить заказ"
        />
      </section>
    </main>
  );
}

async function getOrderOrNotFound(orderId: number) {
  try {
    return await workshopApi.getOrder(orderId);
  } catch {
    notFound();
  }
}
