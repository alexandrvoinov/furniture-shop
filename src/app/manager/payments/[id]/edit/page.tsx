import { notFound } from 'next/navigation';

import { workshopApi, type MetadataResponse, type Order } from '@/entities/workshop';

import { updatePaymentAction } from '../../../_actions/paymentActions';
import { ApiNotice, PageTitle, PanelTitle } from '../../../_components/ManagerUi';
import { PaymentForm } from '../../../_components/PaymentForm';
import { emptyList, pickResult } from '../../../_lib/managerData';
import styles from '../../../ManagerPage.module.scss';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type EditPaymentPageProps = {
  params: Promise<{ id: string }>;
};

const emptyMetadata: MetadataResponse = {
  order_statuses: [],
  payment_states: [],
  payment_statuses: [],
};

export default async function EditPaymentPage({ params }: EditPaymentPageProps) {
  const paymentId = Number((await params).id);

  if (!Number.isInteger(paymentId) || paymentId <= 0) {
    notFound();
  }

  const payment = await getPaymentOrNotFound(paymentId);
  const results = await Promise.allSettled([
    workshopApi.getMetadata(),
    workshopApi.listOrders({ limit: 100, offset: 0, sort_by: 'created_at', sort_order: 'desc' }),
  ]);
  const errors: string[] = [];
  const metadata = pickResult(results[0], emptyMetadata, 'metadata', errors);
  const orders = pickResult(results[1], emptyList<Order>(), 'orders', errors);
  const statuses =
    payment.status && !metadata.payment_statuses.includes(payment.status)
      ? [payment.status, ...metadata.payment_statuses]
      : metadata.payment_statuses;

  return (
    <main className={styles.page}>
      <PageTitle eyebrow="Редактирование" title={`Оплата #${payment.id}`} />
      <ApiNotice errors={errors} />

      <section className={styles.panel}>
        <PanelTitle eyebrow="Финансы" title="Данные оплаты" />
        <PaymentForm
          action={updatePaymentAction}
          defaultValues={{
            amount: payment.amount,
            id: payment.id,
            order_id: payment.order_id,
            status: payment.status,
          }}
          mode="edit"
          orders={orders.items}
          statuses={statuses}
          submitLabel="Сохранить оплату"
        />
      </section>
    </main>
  );
}

async function getPaymentOrNotFound(paymentId: number) {
  try {
    return await workshopApi.getPayment(paymentId);
  } catch {
    notFound();
  }
}
